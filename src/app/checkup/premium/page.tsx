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
import { PREMIUM_GROUPS } from "@/lib/checkups";

const PATH = "/checkup/premium";
const TITLE = "정밀종합검사";
const DESCRIPTION =
  "일산서울내과의원 정밀종합검사 안내. 수면 위내시경과 복부·갑상선 초음파, 골밀도, 폐기능, 흉부 엑스레이, 심전도에 종합 혈액검사 51종과 6종 암 표지자, 갑상선 호르몬·면역 검사까지 한 번에 확인합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

const TOTAL_ITEMS = PREMIUM_GROUPS.reduce(
  (sum, group) => sum + group.items.length,
  0,
);

/** 카드별 강조색 — 파랑·청록 계열 안에서만 변주합니다 */
const ACCENTS = ["#1a3a6c", "#2b5ba8", "#2f9fc4", "#2e9580", "#4bb89c", "#3f6fb5"];

export default function PremiumCheckupPage() {
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
          about: { type: "MedicalTest", name: "정밀종합검사" },
          faq: [
            {
              q: "일산서울내과의원 정밀종합검사에는 어떤 항목이 포함되나요?",
              a: "혈압·신체계측·비만도 측정, 수면 위내시경(전자내시경), 복부 초음파, 갑상선 초음파, 골밀도 검사, 폐기능 검사, 흉부 엑스레이, 심전도와 함께 종합 혈액검사 51종, 간암(AFP)·대장암(CEA)·췌장암(CA19-9)·난소암(CA125)·전립선암(PSA)·방광암 표지자 검사, 갑상선 호르몬과 면역항체, 에이즈·매독 검사, 류마티스 인자 검사가 포함됩니다.",
            },
          ],
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="COMPREHENSIVE CHECK-UP · 정밀종합검사"
          title={
            <>
              흩어진 검사를 한 번에,
              <br />
              <em>빠짐없이</em> 확인합니다
            </>
          }
          sub={
            <>
              내시경과 초음파, 혈액검사, 암 표지자 검사까지 한 자리에서
              진행하고
              <br />
              결과는 원장이 직접 확인하여 설명해 드립니다.
            </>
          }
          cards={
            <>
              <HeroInfoCard icon="eye" label="영상 검사" delay="d2">
                내시경 · 초음파 · 골밀도
              </HeroInfoCard>
              <HeroInfoCard icon="drop" label="혈액검사" teal delay="d3">
                종합 혈액검사 51종
              </HeroInfoCard>
              <HeroInfoCard icon="alert" label="암 표지자" delay="d4">
                6종 표지자 검사
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question="정밀종합검사에는 어떤 항목이 포함되나요?"
            facts={[
              "수면 위내시경 포함",
              "복부·갑상선 초음파",
              "혈액검사 51종",
              "암 표지자 6종",
            ]}
          >
            일산서울내과의원 정밀종합검사는 혈압·신체계측·비만도 측정, 수면
            위내시경, 복부 초음파, 갑상선 초음파, 골밀도 검사, 폐기능 검사, 흉부
            엑스레이, 심전도와 함께 종합 혈액검사 51종, 6종 암 표지자 검사,
            갑상선 호르몬·면역 검사까지 한 번에 확인하는 검사입니다.
          </KeyAnswer>
        </Section>

        <Section tightTop>
          <SectionHeader
            eyebrow="TEST ITEMS"
            title={`검사 항목 (총 ${TOTAL_ITEMS}개 묶음)`}
            desc="영상 검사부터 혈액·호르몬 검사까지 단계별로 확인합니다."
          />

          <div className="sp_trt_grid">
            {PREMIUM_GROUPS.map((group, index) => (
              <div
                className={`eum_rv d${Math.min(index + 2, 5)} sp_trt_card`}
                key={group.label}
                data-accent=""
                style={
                  {
                    "--accent": ACCENTS[index % ACCENTS.length],
                  } as React.CSSProperties
                }
              >
                <div className="sp_deco" />
                <div className="sp_trt_icon">
                  <Icon name={group.icon} />
                </div>
                <h3 className="sp_trt_title">{group.label}</h3>
                <div className="sp_trt_list">
                  {group.items.map((item) => (
                    <div className="sp_trt_item" key={item}>
                      <span className="sp_dot" />
                      <span className="sp_trt_text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section alt narrow>
          <Note title="검사 전 준비사항" navy>
            수면 위내시경과 복부 초음파, 공복 혈액검사가 포함되므로 검사 전날
            저녁부터 금식이 필요합니다. 예약하실 때 준비사항과 소요 시간을
            자세히 안내해 드립니다.
          </Note>
          <p className="eum_rv d2 sp_disclaimer">
            검사 항목은 개인의 건강 상태와 필요에 따라 조정될 수 있습니다.
            자세한 사항은 진료 시 확인해 드립니다.
          </p>
        </Section>

        <SubCta
          title={
            <>
              정밀종합검사는
              <br />
              예약 후 진행됩니다
            </>
          }
          sub="검사 소요 시간과 준비사항을 전화로 안내해 드립니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="검사안내 전체보기 →"
          secondaryHref="/checkup"
        />
      </SubPage>
    </>
  );
}
