import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/subpage/FaqAccordion";
import {
  SubPage,
  SubHero,
  HeroInfoCard,
  KeyAnswer,
  Section,
  SectionHeader,
  SubCta,
} from "@/components/subpage/parts";
import { pageSchemas, toFaqPairs } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { ENDOSCOPY_FAQ } from "@/lib/endoscopy";

const PATH = "/endoscopy/faq";
const TITLE = "수면 위 내시경 FAQ";
const DESCRIPTION =
  "일산서울내과의원 수면 위 내시경 자주 묻는 질문 10가지. 가능한 연령대, 검사 소요 시간, 안전성, 소독 방법, 예약 방법, 금식 시간, 고혈압·당뇨약 복용, 검사 당일 활동, 결과 확인 시점을 안내합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

export default function EndoscopyFaqPage() {
  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [
            { name: "수면 위내시경", url: "/endoscopy" },
            { name: TITLE, url: PATH },
          ],
          medical: true,
          about: { type: "MedicalProcedure", name: "수면 위내시경" },
          faq: toFaqPairs(ENDOSCOPY_FAQ),
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="FAQ · 자주 묻는 질문"
          title={
            <>
              수면 위 내시경,
              <br />
              <em>궁금한 것부터</em> 확인하세요
            </>
          }
          sub={
            <>
              검사 전에 가장 많이 물어보시는 10가지 질문을 모았습니다.
              <br />
              여기에 없는 내용은 예약 시 자세히 설명해 드립니다.
            </>
          }
          cards={
            <>
              <HeroInfoCard icon="user" label="가능 연령" delay="d2">
                15세 ~ 70세
              </HeroInfoCard>
              <HeroInfoCard icon="clock" label="소요시간" teal delay="d3">
                1시간 ~ 1시간 30분
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="예약 문의" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question="수면 위 내시경 예약은 어떻게 하나요?"
            facts={[
              "전화 예약",
              "한 시간에 한 분",
              "12시간 이상 공복",
              "당일 결과 확인",
            ]}
          >
            일산서울내과의원 {CLINIC.telephoneDisplay} 로 전화하시면 수면 위
            내시경 예약이 가능합니다. 대한소화기내시경학회 권장 소독 과정을
            지키기 위해 자동소독기로 소독하며, 한 시간 간격으로 한 분씩만 검사를
            진행합니다.
          </KeyAnswer>
        </Section>

        <Section tightTop narrow>
          <SectionHeader
            eyebrow="QUESTIONS"
            title="자주 묻는 질문 10가지"
            desc="질문을 누르면 답변이 열립니다."
          />
          <FaqAccordion categories={[{ items: [...ENDOSCOPY_FAQ] }]} />

          <p className="eum_rv d3 sp_disclaimer">
            위 내용은 일반적인 안내이며, 개인의 건강 상태에 따라 검사 가능 여부와
            준비사항이 달라질 수 있습니다. 자세한 사항은 진료 시 확인해
            드립니다.
          </p>
        </Section>

        <SubCta
          title={
            <>
              답을 찾지 못하셨다면
              <br />
              전화로 물어보세요
            </>
          }
          sub="예약 시 준비사항을 하나하나 자세히 설명해 드립니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="수면 위 내시경 안내 →"
          secondaryHref="/endoscopy"
        />
      </SubPage>
    </>
  );
}
