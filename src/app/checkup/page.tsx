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
  Note,
  SubCta,
} from "@/components/subpage/parts";
import Icon, { type IconName } from "@/components/subpage/icons";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC, SITE_URL } from "@/lib/site";
import { CHECKUPS } from "@/lib/checkups";

const PATH = "/checkup";
const TITLE = "검사안내";
const DESCRIPTION =
  "일산서울내과의원 검사안내. 고혈압·당뇨병·B형간염 6개월 정기검사, 국민건강보험공단 일반건강검진과 위암·간암 검진, 생애전환기 건강진단, 정밀종합검사를 원장이 직접 시행하고 결과를 설명합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

type CheckupLink = {
  href: string;
  label: string;
  desc: string;
  icon: IconName;
  tags: string[];
};

const LINKS: CheckupLink[] = [
  ...CHECKUPS.map((item) => ({
    href: item.path,
    label: item.label,
    desc: item.summary,
    icon: item.icon,
    tags: ["6개월마다", "합병증 확인"],
  })),
  {
    href: "/checkup/nhis",
    label: "국민공단검진",
    desc: "일반건강검진, 5대암 중 위암·간암 검진, 만 40세·66세 생애전환기 건강진단을 시행합니다.",
    icon: "checkCircle",
    tags: ["일반건강검진", "위암·간암 검진", "생애전환기"],
  },
  {
    href: "/checkup/premium",
    label: "정밀종합검사",
    desc: "수면 위내시경과 초음파, 혈액 51종, 암 표지자 검사까지 한 번에 확인하는 종합검사입니다.",
    icon: "list",
    tags: ["내시경·초음파", "혈액 51종", "암 표지자"],
  },
];

function collectionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${PATH}#list`,
    name: `${TITLE} | ${CLINIC.name}`,
    itemListElement: LINKS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${SITE_URL}${item.href}`,
    })),
  };
}

export default function CheckupIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          ...pageSchemas({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            breadcrumb: [{ name: TITLE, url: PATH }],
            medical: true,
          }),
          collectionSchema(),
        ]}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="CHECK-UP · 검사안내"
          title={
            <>
              검사하고 끝이 아니라,
              <br />
              <em>결과를 함께 봅니다</em>
            </>
          }
          sub={
            <>
              일산서울내과의원은 원장이 직접 검사하고 결과를 확인하여
              <br />
              실제 치료까지 이어서 받으실 수 있도록 진행합니다.
            </>
          }
          cards={
            <>
              <HeroInfoCard icon="clock" label="정기검사 주기" delay="d2">
                6개월마다
              </HeroInfoCard>
              <HeroInfoCard icon="checkCircle" label="공단검진" teal delay="d3">
                일반건강검진 · 위암 · 간암
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="검사 문의" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question="일산서울내과의원에서는 어떤 검사를 받을 수 있나요?"
            facts={[
              "고혈압·당뇨병·B형간염 정기검사",
              "국민건강보험공단 검진",
              "위암·간암 검진",
              "정밀종합검사",
            ]}
          >
            일산서울내과의원에서는 고혈압·당뇨병·B형간염으로 치료 중인 분들을
            위한 6개월 주기 정기검사, 국민건강보험공단 일반건강검진과 위암·간암
            검진, 만 40세·만 66세 생애전환기 건강진단, 그리고 수면 위내시경과
            초음파·혈액 51종·암 표지자 검사를 포함한 정밀종합검사를 받으실 수
            있습니다.
          </KeyAnswer>
        </Section>

        <Section tightTop>
          <SectionHeader
            eyebrow="PROGRAMS"
            title="검사 항목 안내"
            desc="필요한 검사를 눌러 자세한 내용을 확인해 보세요."
          />

          <div className="sp_trt_grid">
            {LINKS.map((item, index) => (
              <Link
                href={item.href}
                key={item.href}
                className={`eum_rv d${Math.min(index + 2, 5)} sp_trt_card`}
              >
                <div className="sp_deco" />
                <div className="sp_trt_icon">
                  <Icon name={item.icon} />
                </div>
                <h3 className="sp_trt_title">{item.label}</h3>
                <div className="sp_trt_list">
                  <div className="sp_trt_item">
                    <span className="sp_dot" />
                    <span className="sp_trt_text">{item.desc}</span>
                  </div>
                </div>
                <div className="sp_tags">
                  {item.tags.map((tag) => (
                    <span className="sp_tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section narrow tightTop>
          <Note title="검사 전 확인해 주세요" navy>
            검사 항목과 준비사항은 개인의 건강 상태와 복용 중인 약에 따라 달라질
            수 있습니다. 검사 예약 시 준비사항을 자세히 안내해 드리며, 공복이
            필요한 검사는 미리 알려 드립니다.
          </Note>
        </Section>

        <SubCta
          title={
            <>
              어떤 검사가 필요한지
              <br />
              모르시겠다면 문의해 주세요
            </>
          }
          sub="내원하시면 올해 공단검진 대상인지도 확인해 드립니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="찾아오시는 길 →"
          secondaryHref="/location"
        />
      </SubPage>
    </>
  );
}
