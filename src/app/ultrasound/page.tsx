import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import {
  SubPage,
  Section,
  SummaryBox,
  Gallery,
} from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC, SITE_URL } from "@/lib/site";
import { ULTRASOUNDS } from "@/lib/ultrasound";

const PATH = "/ultrasound";
const TITLE = "초음파검사 안내";
const DESCRIPTION =
  "일산서울내과의원 초음파검사 안내. 심장초음파 세부인증의 김금미 원장이 심장·경동맥·갑상선·복부 초음파를 직접 검사하고 결과를 설명합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

function collectionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${PATH}#list`,
    name: `${TITLE} | ${CLINIC.name}`,
    itemListElement: ULTRASOUNDS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}

/*
  원장님 요청(2026-10-22·10-27)
  · 첫 상자는 절반 크기, 오른쪽에 심장·경동맥·갑상선·복부 큰 상자 → 누르면 같은 페이지 아래로 이동
  · 네 가지 검사를 한 페이지에 차례로: 제목 → 검사 화면 예시 → 살펴보는 내용
*/
export default function UltrasoundIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          ...pageSchemas({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            breadcrumb: [{ name: "초음파검사", url: PATH }],
            medical: true,
          }),
          collectionSchema(),
        ]}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <div className="sp_hero blue us_hero">
          <div className="sp_hero_glow" />
          <div className="us_hero_inner">
            <div>
              <div className="eum_rv d1 sp_eyebrow">
                <span className="sp_eyebrow_line" />
                ULTRASOUND · 초음파검사
              </div>
              <h2 className="eum_rv d2 sp_hero_title">
                영상으로 함께 확인,
                <br />
                <em>바로 설명해드리고, 치료에 적용합니다</em>
              </h2>
              <p className="eum_rv d3 sp_hero_sub">
                심장초음파 세부인증의인 원장이 직접 검사하고 검사 영상을 함께
                보며 결과를 설명해 드립니다.
              </p>
            </div>

            <nav className="eum_rv d3 us_jump" aria-label="초음파 검사 종류">
              {ULTRASOUNDS.map((item) => (
                <a key={item.slug} href={`#${item.slug}`}>
                  {item.label}
                  <span aria-hidden="true">↓</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {ULTRASOUNDS.map((item, index) => (
          <section id={item.slug} className="us_block" key={item.slug}>
            <Section alt={index % 2 === 1}>
              <h2 className="eum_rv d1 us_block_title">
                {item.label}, <em>원장이 직접</em> 검사합니다
              </h2>
              <Gallery items={item.images} />
              <SummaryBox
                title={`${item.label}로 살펴보는 내용`}
                items={item.points}
              />
            </Section>
          </section>
        ))}

        <Section narrow tightTop>
          <p className="eum_rv d1 sp_disclaimer">
            검사 화면은 개인 식별정보를 제외한 예시이며, 검사 방법과 결과
            해석은 개인의 건강 상태에 따라 달라질 수 있습니다.
          </p>
        </Section>
      </SubPage>
    </>
  );
}
