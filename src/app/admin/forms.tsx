"use client";

import { useActionState, useState } from "react";

import {
  login,
  saveEssayAction,
  saveNoticeAction,
  type FormState,
} from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
    undefined,
  );
  /* 비밀번호가 틀려도 아이디는 지워지지 않게 */
  const [loginId, setLoginId] = useState("");

  return (
    <form action={action} className="ad_form" autoComplete="on">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="ad_field">
        <span>아이디</span>
        <input
          name="id"
          type="text"
          value={loginId}
          onChange={(event) => setLoginId(event.target.value)}
          autoComplete="username"
          required
          autoFocus
          maxLength={60}
        />
      </label>
      <label className="ad_field">
        <span>비밀번호</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
        />
      </label>
      {state?.error && (
        <p className="ad_error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="ad_btn primary" disabled={pending}>
        {pending ? "확인하는 중…" : "로그인"}
      </button>
    </form>
  );
}

export function NoticeForm({
  notice,
}: {
  notice?: { id: string; title: string; body: string; pinned: boolean };
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveNoticeAction,
    undefined,
  );

  return (
    <form action={action} className="ad_form">
      {notice && <input type="hidden" name="id" value={notice.id} />}

      <label className="ad_field">
        <span>제목</span>
        <input
          name="title"
          type="text"
          required
          maxLength={100}
          defaultValue={notice?.title ?? ""}
          placeholder="예) 10월 31일(금) 휴진 안내"
        />
      </label>

      <label className="ad_field">
        <span>내용</span>
        <textarea
          name="body"
          required
          rows={10}
          maxLength={5000}
          defaultValue={notice?.body ?? ""}
          placeholder="환자분들께 알릴 내용을 적어 주세요."
        />
      </label>

      <label className="ad_check">
        <input
          name="pinned"
          type="checkbox"
          defaultChecked={notice?.pinned ?? false}
        />
        <span>
          <strong>목록 맨 위에 고정</strong>
          <em>휴진 안내처럼 꼭 보여야 하는 공지에 켜 주세요.</em>
        </span>
      </label>

      <p className="ad_hint">
        공지는 누구나 볼 수 있는 공개 글입니다. 환자 이름·연락처 같은 개인정보는
        적지 마세요.
      </p>

      {state?.error && (
        <p className="ad_error" role="alert">
          {state.error}
        </p>
      )}

      <div className="ad_row">
        <button type="submit" className="ad_btn primary" disabled={pending}>
          {pending ? "저장하는 중…" : notice ? "수정 저장" : "공지 올리기"}
        </button>
        {notice && (
          <a href="/admin" className="ad_btn">
            취소
          </a>
        )}
      </div>
    </form>
  );
}

/** 오늘 날짜를 한국 시간 기준 YYYY-MM-DD 로 (달력 칸의 기본값) */
function todayKst() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts; // en-CA 형식이 곧 YYYY-MM-DD
}

export function EssayForm({
  essay,
}: {
  essay?: {
    id: string;
    title: string;
    /** YYYY-MM-DD */
    date: string;
    source: string;
    body: string;
  };
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveEssayAction,
    undefined,
  );

  return (
    <form action={action} className="ad_form">
      {essay && <input type="hidden" name="id" value={essay.id} />}

      <label className="ad_field">
        <span>제목</span>
        <input
          name="title"
          type="text"
          required
          maxLength={100}
          defaultValue={essay?.title ?? ""}
          placeholder="예) 가을 진료실에서"
        />
      </label>

      <label className="ad_field">
        <span>날짜</span>
        <input
          name="date"
          type="date"
          required
          defaultValue={essay?.date ?? todayKst()}
        />
      </label>

      <label className="ad_field">
        <span>
          출처 <em className="ad_opt">(신문·잡지에 낸 글일 때만)</em>
        </span>
        <input
          name="source"
          type="text"
          maxLength={100}
          defaultValue={essay?.source ?? ""}
          placeholder="예) 의협신문 · 2026.10.17"
        />
      </label>

      <label className="ad_field">
        <span>내용</span>
        <textarea
          name="body"
          required
          rows={16}
          maxLength={30000}
          defaultValue={essay?.body ?? ""}
          placeholder="글을 적어 주세요."
        />
      </label>

      <p className="ad_hint">
        문단을 나누려면 <strong>빈 줄을 한 줄</strong> 넣어 주세요. 환자 이름·연락처
        같은 개인정보는 적지 마세요. (사진 넣기는 아직 되지 않습니다)
      </p>

      {state?.error && (
        <p className="ad_error" role="alert">
          {state.error}
        </p>
      )}

      <div className="ad_row">
        <button type="submit" className="ad_btn primary" disabled={pending}>
          {pending ? "저장하는 중…" : essay ? "수정 저장" : "에세이 올리기"}
        </button>
        {essay && (
          <a href="/admin?tab=essay" className="ad_btn">
            취소
          </a>
        )}
      </div>
    </form>
  );
}

/** 삭제 단추 — 누르면 「정말 삭제할까요?」 확인창이 먼저 뜹니다 (실수로 지우지 않게) */
export function DeleteButton({ message }: { message: string }) {
  return (
    <button
      type="submit"
      className="ad_btn small danger"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      삭제
    </button>
  );
}
