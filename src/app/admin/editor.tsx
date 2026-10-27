"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { saveEssayAction, saveNoticeAction, type FormState } from "./actions";

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
};

const LIMIT: Record<Kind, number> = { notice: 5000, essay: 30000 };

const noopSubscribe = () => () => {};

/** 이 기기에 남아 있는 임시 저장본(글자 그대로) — 없으면 null */
function readDraft(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const draft = JSON.parse(raw) as { title?: string; body?: string };
    return draft.title || draft.body ? raw : null;
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

  /* 처음 열었을 때 이 기기에 남아 있던 임시 저장본 (새 글일 때만 안내) */
  const savedDraft = useSyncExternalStore(
    noopSubscribe,
    () => readDraft(draftKey),
    () => null,
  );
  const [initialDraft] = useState(() => savedDraft);
  const showDraftNotice =
    !initial?.id && !draftHandled && !!(initialDraft ?? savedDraft) && !title && !body;

  /* 쓰는 동안 임시 저장 */
  useEffect(() => {
    try {
      if (title || body) {
        window.localStorage.setItem(draftKey, JSON.stringify({ title, body }));
      }
    } catch {
      /* 무시 */
    }
  }, [draftKey, title, body]);

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
                };
                setTitle(draft.title ?? "");
                setBody(draft.body ?? "");
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
          <button type="submit" className="bl_btn primary" disabled={pending}>
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
