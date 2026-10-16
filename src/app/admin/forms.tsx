"use client";

import { useActionState } from "react";

import { login, saveNoticeAction, type FormState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} className="ad_form" autoComplete="on">
      <label className="ad_field">
        <span>아이디</span>
        <input
          name="id"
          type="text"
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
