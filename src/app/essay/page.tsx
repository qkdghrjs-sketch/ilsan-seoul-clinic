import type { Metadata } from "next";
import Link from "next/link";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import {
  SubPage,
  SubHero,
  HeroInfoCard,
  Section,
  SectionHeader,
  SubCta,
} from "@/components/subpage/parts";
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

export default async function EssayIndexPage() {
  const ESSAYS = await getAllEssays();

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
        <SubHero
          eyebrow="ESSAY · 김금미 에세이"
          title={
            <>
              진료실에서 만난
              <br />
              <em>사람들의 이야기</em>
            </>
          }
          sub="김금미 원장이 직접 쓴 글입니다. 신문과 잡지에 기고한 글도 함께 실었습니다."
          cards={
            <>
              <HeroInfoCard icon="chat" label="글" delay="d2">
                {ESSAYS.length}편
              </HeroInfoCard>
              <HeroInfoCard icon="user" label="글쓴이" teal delay="d3">
                김금미 원장
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="문의" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop>
          <SectionHeader
            eyebrow="LIST"
            title="에세이 목록"
            desc="읽고 싶은 글을 눌러 주세요."
          />

          <ul className="es_list">
            {ESSAYS.map((item, index) => (
              <li
                key={item.id}
                className={`eum_rv d${Math.min(index + 1, 5)}`}
              >
                <Link href={`${PATH}/${item.id}`} className="es_item">
                  <span className="es_item_date">{item.date}</span>
                  <span className="es_item_body">
                    <strong className="es_item_title">{item.title}</strong>
                    <span className="es_item_excerpt">{item.excerpt}</span>
                    {item.source && (
                      <span className="es_item_source">{item.source}</span>
                    )}
                  </span>
                  <span className="es_item_arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <SubCta
          title={
            <>
              진료와 검사 예약은
              <br />
              전화로 해 주세요
            </>
          }
          sub="충분히 듣고, 정확히 검사하고, 끝까지 함께 보는 진료를 합니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="찾아오시는 길 →"
          secondaryHref="/location"
        />
      </SubPage>
    </>
  );
}
