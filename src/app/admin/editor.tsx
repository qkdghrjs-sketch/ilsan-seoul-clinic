"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { saveEssayAction, saveNoticeAction, type FormState } from "./actions";
import "@/components/subpage/photos.css";

/**
 * 블로그식 글쓰기 화면 — 공지사항·김금미 에세이가 함께 씁니다.
 * 원장님 요청(2026-10-27): 블로그처럼 쉽게.
 *  · 큰 제목 칸 + 넓은 본문 칸, 맨 아래 「올리기」 하나
 *  · 쓰는 동안 이 기기(브라우저)에 임시 저장 → 창이 닫혀도 다시 열면 이어 쓰기
 *  · 올리면 방금 쓴 글 화면으로 바로 이동
 */

type Kind = "notice" | "essay";

export type EditorInitial = {
  id?: string;
  title?: string;
  body?: string;
  /** 공지: 목록 맨 위 고정 */
  pinned?: boolean;
  /** 에세이: YYYY-MM-DD */
  date?: string;
  /** 에세이: 출처 */
  source?: string;
  /** 공지: 본문 아래 사진 */
  images?: Photo[];
};

/** 공지 사진 한 장 (주소 + 가로·세로) */
type Photo = { url: string; w: number; h: number };

/** 글 하나에 넣을 수 있는 사진 수 (서버 src/lib/notice-images.ts 와 같게) */
const PHOTO_MAX = 5;
/** 긴 쪽을 이 크기로 줄여서 올립니다 */
const PHOTO_SIDE = 1600;

/**
 * 사진을 줄여 JPEG로 바꿉니다.
 * 휴대폰 사진은 한 장이 수 MB라 그대로는 느리고, 촬영 위치 같은 정보도 들어 있어
 * 새로 그려서(=사진 속 부가 정보 없이) 올립니다.
 */
async function shrinkPhoto(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, PHOTO_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#ffffff"; // 투명한 그림은 흰 바탕으로
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) throw new Error("toBlob");
  return { blob, w, h };
}

const LIMIT: Record<Kind, number> = { notice: 5000, essay: 30000 };

const noopSubscribe = () => () => {};

/** 이 기기에 남아 있는 임시 저장본(글자 그대로) — 없으면 null */
function readDraft(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const draft = JSON.parse(raw) as { title?: string; body?: string; photos?: Photo[] };
    return draft.title || draft.body || draft.photos?.length ? raw : null;
  } catch {
    return null;
  }
}

function todayKst() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function BlogEditor({
  kind,
  initial,
  cancelHref,
}: {
  kind: Kind;
  initial?: EditorInitial;
  cancelHref: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    kind === "notice" ? saveNoticeAction : saveEssayAction,
    undefined,
  );

  const draftKey = `ilsan-draft-${kind}-${initial?.id ?? "new"}`;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [draftHandled, setDraftHandled] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  /* 공지 사진 */
  const [photos, setPhotos] = useState<Photo[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(0);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addPhotos = async (files: File[]) => {
    setPhotoError("");
    const room = PHOTO_MAX - photos.length;
    if (room <= 0) return;
    if (files.length > room) {
      setPhotoError(
        `사진은 글 하나에 ${PHOTO_MAX}장까지 넣을 수 있습니다. 앞의 ${room}장만 넣었습니다.`,
      );
    }
    const picked = files.slice(0, room);
    setUploading(picked.length);
    for (const file of picked) {
      try {
        const { blob, w, h } = await shrinkPhoto(file);
        const data = new FormData();
        data.append("file", blob, "photo.jpg");
        const response = await fetch("/api/notice-image", { method: "POST", body: data });
        const result = (await response.json().catch(() => null)) as {
          ok?: boolean;
          url?: string;
          error?: string;
        } | null;
        if (!response.ok || !result?.ok || !result.url) {
          setPhotoError(result?.error ?? "사진을 올리지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
        } else {
          const url = result.url;
          setPhotos((list) => (list.length < PHOTO_MAX ? [...list, { url, w, h }] : list));
        }
      } catch {
        setPhotoError(
          `「${file.name}」은 사진으로 열 수 없습니다. JPG·PNG 사진으로 다시 골라 주세요.`,
        );
      }
      setUploading((count) => Math.max(0, count - 1));
    }
    setUploading(0);
  };

  /* 처음 열었을 때 이 기기에 남아 있던 임시 저장본 (새 글일 때만 안내) */
  const savedDraft = useSyncExternalStore(
    noopSubscribe,
    () => readDraft(draftKey),
    () => null,
  );
  const [initialDraft] = useState(() => savedDraft);
  const showDraftNotice =
    !initial?.id &&
    !draftHandled &&
    !!(initialDraft ?? savedDraft) &&
    !title &&
    !body &&
    !photos.length;

  /* 쓰는 동안 임시 저장 */
  useEffect(() => {
    try {
      if (title || body || photos.length) {
        window.localStorage.setItem(draftKey, JSON.stringify({ title, body, photos }));
      }
    } catch {
      /* 무시 */
    }
  }, [draftKey, title, body, photos]);

  /* 본문 칸이 글 길이에 맞춰 늘어납니다 */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 360)}px`;
  }, [body]);

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      /* 무시 */
    }
  };

  return (
    <form
      action={(formData) => {
        clearDraft();
        return action(formData);
      }}
      className="bl_form"
    >
      <input type="hidden" name="return" value="post" />
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      {showDraftNotice && (
        <p className="bl_restored">
          지난번에 쓰다 만 글이 있습니다.
          <button
            type="button"
            onClick={() => {
              try {
                const draft = JSON.parse(savedDraft ?? "{}") as {
                  title?: string;
                  body?: string;
                  photos?: Photo[];
                };
                setTitle(draft.title ?? "");
                setBody(draft.body ?? "");
                if (kind === "notice" && Array.isArray(draft.photos)) {
                  setPhotos(draft.photos.slice(0, PHOTO_MAX));
                }
              } catch {
                /* 무시 */
              }
              setDraftHandled(true);
            }}
          >
            이어 쓰기
          </button>
          <button
            type="button"
            onClick={() => {
              clearDraft();
              setDraftHandled(true);
            }}
          >
            지우고 새로 쓰기
          </button>
        </p>
      )}

      <input
        name="title"
        className="bl_title"
        type="text"
        required
        maxLength={100}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="제목을 입력하세요"
        aria-label="제목"
        autoFocus={!initial?.id}
      />

      {kind === "essay" && (
        <div className="bl_meta">
          <label>
            <span>날짜</span>
            <input
              name="date"
              type="date"
              required
              defaultValue={initial?.date ?? todayKst()}
            />
          </label>
          <label className="grow">
            <span>출처 (신문·잡지에 낸 글일 때만)</span>
            <input
              name="source"
              type="text"
              maxLength={100}
              defaultValue={initial?.source ?? ""}
              placeholder="예) 의협신문 2026.10.27"
            />
          </label>
        </div>
      )}

      <textarea
        ref={bodyRef}
        name="body"
        className="bl_body"
        required
        maxLength={LIMIT[kind]}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={
          kind === "notice"
            ? "환자분들께 알릴 내용을 편하게 적어 주세요.\n\n예) 10월 31일(금)은 원장님 학회 참석으로 휴진합니다."
            : "글을 편하게 적어 주세요.\n문단을 나누려면 빈 줄을 한 줄 넣어 주세요."
        }
        aria-label="내용"
      />

      {kind === "notice" && (
        <div className="bl_photos">
          <input type="hidden" name="images" value={JSON.stringify(photos)} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              if (files.length) void addPhotos(files);
            }}
          />
          <div className="bl_photos_head">
            <button
              type="button"
              className="bl_btn bl_photo_add"
              disabled={uploading > 0 || photos.length >= PHOTO_MAX}
              onClick={() => fileRef.current?.click()}
            >
              {uploading > 0 ? "사진 올리는 중…" : "＋ 사진 넣기"}
            </button>
            <span className="bl_photos_count">
              사진 {photos.length} / {PHOTO_MAX}장 · 글 아래에 올린 순서대로 보입니다
            </span>
          </div>

          {photos.length > 0 && (
            <ul className="bl_photo_list">
              {photos.map((photo, index) => (
                <li key={photo.url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={`넣은 사진 ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() =>
                      setPhotos((list) => list.filter((item) => item.url !== photo.url))
                    }
                    aria-label={`사진 ${index + 1} 빼기`}
                  >
                    빼기
                  </button>
                </li>
              ))}
            </ul>
          )}

          {photoError && (
            <p className="bl_error" role="alert">
              {photoError}
            </p>
          )}
          <p className="bl_hint">
            환자 이름·생년월일·검사 화면·진료 기록이 찍힌 사진은 올리지 마세요. 큰 사진은 올릴 때
            자동으로 줄어듭니다.
          </p>
        </div>
      )}

      <div className="bl_bar">
        <div className="bl_bar_left">
          {kind === "notice" && (
            <label className="bl_pin">
              <input
                name="pinned"
                type="checkbox"
                defaultChecked={initial?.pinned ?? false}
              />
              <span>목록 맨 위에 고정</span>
            </label>
          )}
          <span className="bl_count">
            {body.length.toLocaleString("ko-KR")}자
          </span>
        </div>
        <div className="bl_bar_right">
          <a href={cancelHref} className="bl_btn">
            취소
          </a>
          <button type="submit" className="bl_btn primary" disabled={pending || uploading > 0}>
            {pending ? "올리는 중…" : initial?.id ? "수정 완료" : "올리기"}
          </button>
        </div>
      </div>

      {state?.error && (
        <p className="bl_error" role="alert">
          {state.error}
        </p>
      )}
      <p className="bl_hint">
        누구나 볼 수 있는 공개 글입니다. 환자 이름·연락처 같은 개인정보는 적지
        마세요.
      </p>
    </form>
  );
}
