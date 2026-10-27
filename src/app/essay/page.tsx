import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import { SubPage, Section } from "@/components/subpage/parts";
import Board, { toPage, BOARD_PAGE_SIZE } from "@/components/subpage/Board";
import AdminBar from "@/components/subpage/AdminBar";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC, SITE_URL } from "@/lib/site";
import type { Essay } from "@/lib/essays";
import { getAllEssays } from "@/lib/essay-posts";

/** 원장님이 새 글을 올리면 바로 반영되고, 아니어도 1분 안에 갱신됩니다. */
export const revalidate = 60;

const PATH = "/essay";
const TITLE = "김금미 에세이";
const DESCRIPTION =
  "일산서울내과의원 김금미 원장이 진료실에서 겪은 이야기와 신문·잡지에 기고한 글을 모았습니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

function collectionSchema(essays: Essay[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${PATH}#list`,
    name: `${TITLE} | ${CLINIC.name}`,
    itemListElement: essays.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${PATH}/${item.id}`,
    })),
  };
}

/* 원장님 요청(2026-10-27): 머리 문구 없이 공지사항처럼 일반 게시판 */
export default async function EssayIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const ESSAYS = await getAllEssays();
  const page = toPage(
    (await searchParams).page,
    Math.ceil(ESSAYS.length / BOARD_PAGE_SIZE),
  );

  return (
    <>
      <JsonLd
        data={[
          ...pageSchemas({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            breadcrumb: [{ name: TITLE, url: PATH }],
          }),
          collectionSchema(ESSAYS),
        ]}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <Section narrow>
          <Board
            rows={ESSAYS.map((item) => ({
              id: String(item.id),
              title: item.title,
              href: `${PATH}/${item.id}`,
              date: item.date.replace(/-/g, "."),
            }))}
            page={page}
            basePath={PATH}
            emptyText="등록된 글이 없습니다."
          />
          <AdminBar writeHref="/essay/write" returnPath="/essay" />
        </Section>
      </SubPage>
    </>
  );
}