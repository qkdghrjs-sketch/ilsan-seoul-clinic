import Link from "next/link";

/**
 * 일반 게시판 목록 (번호 · 제목 · 등록일) — 공지사항과 김금미 에세이가 함께 씁니다.
 * 원장님 요청(2026-10-27): 옛 홈페이지처럼 평범한 게시판 모양으로.
 */

export const BOARD_PAGE_SIZE = 10;

export type BoardRow = {
  id: string;
  title: string;
  href: string;
  date: string;
  /** 위에 고정된 글(번호 대신 「공지」 표시) */
  pinned?: boolean;
};

/** 주소의 ?page= 값을 안전한 숫자로 */
export function toPage(value: string | string[] | undefined, pageCount: number) {
  const n = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, Math.max(pageCount, 1));
}

export default function Board({
  rows,
  page,
  basePath,
  emptyText,
}: {
  /** 전체 글 (최신순) */
  rows: BoardRow[];
  page: number;
  basePath: string;
  emptyText: string;
}) {
  const pageCount = Math.max(1, Math.ceil(rows.length / BOARD_PAGE_SIZE));
  const start = (page - 1) * BOARD_PAGE_SIZE;
  const visible = rows.slice(start, start + BOARD_PAGE_SIZE);

  return (
    <>
      <table className="bd_table">
        <thead>
          <tr>
            <th className="bd_no" scope="col">
              번호
            </th>
            <th scope="col">제목</th>
            <th className="bd_date" scope="col">
              등록일
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td className="bd_empty" colSpan={3}>
                {emptyText}
              </td>
            </tr>
          ) : (
            visible.map((row, index) => (
              <tr key={row.id}>
                <td className="bd_no">
                  {row.pinned ? (
                    <span className="bd_pin">공지</span>
                  ) : (
                    rows.length - (start + index)
                  )}
                </td>
                <td className="bd_title">
                  <Link href={row.href}>{row.title}</Link>
                </td>
                <td className="bd_date">{row.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pageCount > 1 && (
        <nav className="bd_pager" aria-label="페이지">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) =>
            n === page ? (
              <span key={n} className="on" aria-current="page">
                {n}
              </span>
            ) : (
              <Link key={n} href={n === 1 ? basePath : `${basePath}?page=${n}`}>
                {n}
              </Link>
            ),
          )}
        </nav>
      )}
    </>
  );
}
