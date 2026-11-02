"use client";

import { useEffect, useState } from "react";

/**
 * 에세이 글 화면의 「조회 N」.
 * 같은 브라우저에서 같은 글은 하루 한 번만 서버에 1 을 더합니다.
 */
/** 한 화면에서 두 번 세지 않게 (개발 모드의 이중 실행 포함) */
const SENT = new Set<string>();

export default function EssayViewCounter({ id, initial }: { id: string; initial: number }) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `essay-viewed:${id}`;
    if (SENT.has(key)) return;
    SENT.add(key);
    try {
      if (localStorage.getItem(key) === today) return;
    } catch {
      /* 저장 안 되는 브라우저는 그냥 셉니다 */
    }
    fetch("/api/essay-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { views?: number } | null) => {
        if (data && typeof data.views === "number") {
          setViews(data.views);
          try {
            localStorage.setItem(key, today);
          } catch {
            /* 무시 */
          }
        }
      })
      .catch(() => {});
  }, [id]);

  return <span>조회 {views.toLocaleString("ko-KR")}</span>;
}
