import type { Metadata } from "next";
import Link from "next/link";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import {
  SubPage,
  SubHero,
  HeroInfoCard,
  KeyAnswer,
  Section,
  SectionHeader,
  SubCta,
} from "@/components/subpage/parts";
import Icon from "@/components/subpage/icons";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC, SITE_URL } from "@/lib/site";
import { ULTRASOUNDS } from "@/lib/ultrasound";

const PATH = "/ultrasound";
const TITLE = "초음파검사 안내";
const DESCRIPTION =
  "일산서울내과의원 초음파검사 안내. 심장초음파 세부인증의 김금미 원장이 심장·갑상선·경동맥·복부 초음파를 직접 검사하고 결과를 설명합니다.";

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

/** 카드별 강조색 — 파랑·청록 계열 안에서만 변주합니다 */
const ACCENTS = ["#1a3a6c", "#2b5ba8", "#2f9fc4", "#2e9580"];

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
        <SubHero
          eyebrow="ULTRASOUND · 초음파검사"
          title={
            <>
              영상으로 확인하고,
              <br />
              <em>바로 설명해 드립니다</em>
            </>
          }
          sub={
            <>
              심장초음파 세부인증의인 원장이 직접 검사하고
              <br />
              검사 영상을 함께 보며 결과를 설명해 드립니다.
            </>
          }
          cards={
            <>
              <HeroInfoCard icon="pulse" label="검사 종류" delay="d2">
                심장 · 갑상선 · 경동맥 · 복부
              </HeroInfoCard>
              <HeroInfoCard icon="user" label="검사" teal delay="d3">
                원장 직접 시행
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="검사 문의" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question="일산서울내과의원에서는 어떤 초음파검사를 받을 수 있나요?"
            facts={["심장 초음파", "갑상선 초음파", "경동맥 초음파", "복부 초음파"]}
          >
            일산서울내과의원에서는 심장초음파 세부인증의인 김금미 원장이 심장
            초음파, 갑상선 초음파, 경동맥 초음파, 복부 초음파를 직접 검사하고
            결과를 설명해 드립니다.
          </KeyAnswer>
        </Section>

        <Section tightTop>
          <SectionHeader
            eyebrow="PROGRAMS"
            title="초음파검사 종류"
            desc="궁금한 검사를 눌러 자세한 내용을 확인해 보세요."
          />

          <div className="sp_trt_grid">
            {ULTRASOUNDS.map((item, index) => (
              <Link
                href={item.path}
                key={item.path}
                className={`eum_rv d${Math.min(index + 2, 5)} sp_trt_card`}
                data-accent=""
                style={
                  {
                    "--accent": ACCENTS[index % ACCENTS.length],
                  } as React.CSSProperties
                }
              >
                <div className="sp_deco" />
                <div className="sp_trt_icon">
                  <Icon name={item.icon} />
                </div>
                <h3 className="sp_trt_title">{item.label}</h3>
                <div className="sp_trt_list">
                  <div className="sp_trt_item">
                    <span className="sp_dot" />
                    <span className="sp_trt_text">{item.summary}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <SubCta
          title={
            <>
              어떤 검사가 필요한지
              <br />
              모르시겠다면 문의해 주세요
            </>
          }
          sub="증상과 복용 중인 약을 말씀해 주시면 필요한 검사를 안내해 드립니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="찾아오시는 길 →"
          secondaryHref="/location"
        />
      </SubPage>
    </>
  );
}
