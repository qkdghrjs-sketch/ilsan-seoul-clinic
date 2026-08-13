import Link from "next/link";
import { NAV } from "@/lib/nav";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky">
        404 NOT FOUND
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">
        찾으시는 페이지가 없습니다
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        주소가 변경되었거나 삭제된 페이지일 수 있습니다.
        <br />
        아래 메뉴에서 필요한 안내를 확인해 주세요.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full bg-navy px-7 text-[15px] font-semibold text-white transition-colors hover:bg-blue"
        >
          홈으로
        </Link>
        {NAV.map((group) => (
          <Link
            key={group.label}
            href={group.href}
            className="inline-flex h-12 items-center rounded-full border border-line px-7 text-[15px] font-semibold text-navy transition-colors hover:border-sky hover:bg-mist"
          >
            {group.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
