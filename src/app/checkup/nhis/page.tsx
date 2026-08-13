import type { Metadata } from "next";

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
import Icon from "@/components/subpage/icons";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { NHIS_SECTIONS } from "@/lib/checkups";

const PATH = "/checkup/nhis";
const TITLE = "국민공단검진";
const DESCRIPTION =
  "일산서울내과의원 국민건강보험공단 검진 안내. 만 40세 이상 2년마다 받는 일반건강검진, 5대암 중 위암·간암 검진, 만 40세·만 66세 생애전환기 건강진단을 시행하며 검진 대상 여부도 확인해 드립니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

/** 카드별 강조색 — 파랑·청록 계열 안에서만 변주합니다 */
const ACCENTS = ["#1a3a6c", "#2b5ba8", "#2f9fc4", "#2e9580", "#4bb89c", "#3f6fb5"];

export default function NhisPage() {
  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [
            { name: "검사안내", url: "/checkup" },
            { name: TITLE, url: PATH },
          ],
          medical: true,
          about: { type: "MedicalTest", name: "국민건강보험공단 건강검진" },
          faq: [
            {
              q: "일산서울내과의원에서 국민건강보험공단 검진을 받을 수 있나요?",
              a: "받으실 수 있습니다. 일산서울내과의원에서는 일반건강검진, 5대암 검진 중 위암검진과 간암검진, 그리고 만 40세·만 66세 생애전환기 건강진단을 시행합니다. 대장암·유방암·자궁암 검진은 해당 검사가 가능한 다른 의료기관에서 받으실 수 있습니다.",
            },
            {
              q: "올해 건강검진 대상인지 어떻게 확인하나요?",
              a: "일반건강검진은 만 40세 이상 성인 남녀에게 2년마다 한 번씩 나오며, 보통 홀수년도 출생자는 홀수년도에, 짝수년도 출생자는 짝수년도에 대상이 됩니다. 일산서울내과의원에 내원하시면 올해 검진 대상인지 확인해 드립니다.",
            },
          ],
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="NATIONAL HEALTH CHECK-UP · 국민공단검진"
          title={
            <>
              검진으로 끝내지 않고,
              <br />
              <em>치료까지 이어서</em> 봅니다
            </>
          }
          sub={
            <>
              일산서울내과의원 원장이 직접 꼼꼼하게 검사하고 결과를 체크하여
              <br />
              실제 치료까지 이어서 받으실 수 있도록 진행합니다.
            </>
          }
          cards={
            <>
              <HeroInfoCard icon="checkCircle" label="일반건강검진" delay="d2">
                만 40세 이상 · 2년마다
              </HeroInfoCard>
              <HeroInfoCard icon="alert" label="암검진" teal delay="d3">
                위암 · 간암 (본원 시행)
              </HeroInfoCard>
              <HeroInfoCard icon="clock" label="생애전환기" delay="d4">
                만 40세 · 만 66세
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question="일산서울내과의원에서 국민건강보험공단 검진을 받을 수 있나요?"
            facts={[
              "일반건강검진",
              "위암·간암 검진",
              "생애전환기 건강진단",
              "검진 대상 확인 가능",
            ]}
          >
            받으실 수 있습니다. 일산서울내과의원에서는 일반건강검진, 5대암 검진
            중 위암검진과 간암검진, 그리고 만 40세·만 66세 생애전환기
            건강진단을 시행합니다. 대장암·유방암·자궁암 검진은 해당 검사가
            가능한 다른 의료기관에서 받으실 수 있습니다.
          </KeyAnswer>
        </Section>

        <Section tightTop>
          <SectionHeader
            eyebrow="PROGRAMS"
            title="공단검진 종류"
            desc="어떤 검진 대상인지 확인하고 필요한 항목을 준비해 오세요."
          />

          <div className="sp_feat_grid">
            {NHIS_SECTIONS.map((section, index) => (
              <div
                className={`eum_rv d${index + 2} sp_feat_card`}
                key={section.no}
                data-step={section.no}
                data-accent=""
                style={
                  {
                    "--accent": ACCENTS[index % ACCENTS.length],
                  } as React.CSSProperties
                }
              >
                <span className="sp_feat_num">{section.no}</span>
                <h3 className="sp_feat_title">{section.title}</h3>
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p className="sp_feat_desc" key={pIndex}>
                    {paragraph}
                  </p>
                ))}
                <div className="sp_icon_list">
                  {section.items.map((item) => (
                    <div className="sp_icon_item" key={item}>
                      <span className="sp_icon_badge">
                        <Icon name="check" />
                      </span>
                      <span className="sp_icon_text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section alt narrow>
          <Note title="검진 대상 여부가 헷갈리시나요?" navy>
            내원하시면 올해 검진 대상인지 확인해 드립니다. 위암검진은 내시경
            검사를 포함하므로 공복이 필요하며, 예약 시 준비사항을 자세히 안내해
            드립니다.
          </Note>
          <p className="eum_rv d2 sp_disclaimer">
            검진 항목과 주기는 국민건강보험공단의 기준에 따르며, 기준이 변경될
            경우 달라질 수 있습니다.
          </p>
        </Section>

        <SubCta
          title={
            <>
              공단검진 예약은
              <br />
              전화로 문의해 주세요
            </>
          }
          sub="위암검진(내시경)은 예약제로 운영됩니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="수면 위 내시경 안내 →"
          secondaryHref="/endoscopy"
        />
      </SubPage>
    </>
  );
}
