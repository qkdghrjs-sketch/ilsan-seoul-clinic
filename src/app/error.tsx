"use client";

import Link from "next/link";
import { useEffect } from "react";

import { CLINIC } from "@/lib/site";

/**
 * 화면을 만들다 서버 오류가 났을 때 (영어 「This page couldn't load」 대신 보이는 화면)
 * 2026-10-28 원장님이 공지를 올린 뒤 영어 오류 화면만 보여 글이 안 올라간 줄 아셨던 일로 추가.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky">
        잠시 문제가 생겼습니다
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">
        화면을 불러오지 못했습니다
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        잠시 뒤 「다시 불러오기」를 눌러 주세요.
        <br />
        계속 같은 화면이 나오면 {CLINIC.telephoneDisplay}로 연락해 주세요.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center rounded-full bg-navy px-7 text-[15px] font-semibold text-white transition-colors hover:bg-blue"
        >
          다시 불러오기
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full border border-line px-7 text-[15px] font-semibold text-navy transition-colors hover:border-sky hover:bg-mist"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
