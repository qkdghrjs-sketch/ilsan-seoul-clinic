import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import { SubPage, Section } from "@/components/subpage/parts";
import Board, { toPage, BOARD_PAGE_SIZE } from "@/components/subpage/Board";
import { pageSchemas } from "@/lib/page-schema";
import { formatNoticeDate, getNotices } from "@/lib/notices";

const PATH = "/notice";
const TITLE = "공지사항";
const DESCRIPTION =
  "일산서울내과의원 공지사항. 휴진 안내와 진료 관련 소식을 알려 드립니다.";

/** 원장님이 새 공지를 올리면 바로 반영되고, 아니어도 1분 안에 갱신됩니다. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

/* 원장님 요청(2026-10-27): 머리 문구·「공지 목록」 없이 바로 일반 게시판 */
export default async function NoticeIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const notices = await getNotices();
  const page = toPage(
    (await searchParams).page,
    Math.ceil(notices.length / BOARD_PAGE_SIZE),
  );

  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [{ name: TITLE, url: PATH }],
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <Section narrow>
          <Board
            rows={notices.map((item) => ({
              id: item.id,
              title: item.title,
              href: `${PATH}/${item.id}`,
              date: formatNoticeDate(item.createdAt),
              pinned: item.pinned,
            }))}
            page={page}
            basePath={PATH}
            emptyText="등록된 공지가 없습니다."
          />
        </Section>
      </SubPage>
    </>
  );
}