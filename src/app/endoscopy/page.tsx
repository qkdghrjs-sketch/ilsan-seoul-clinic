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
  IntroBox,
  SummaryBox,
  Note,
  SubCta,
} from "@/components/subpage/parts";
import Icon from "@/components/subpage/icons";
import { pageSchemas, toFaqPairs } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import {
  ENDOSCOPY_INTRO,
  ENDOSCOPY_STEPS,
  ENDOSCOPY_FAQ,
} from "@/lib/endoscopy";

const PATH = "/endoscopy";
const TITLE = "수면 위 내시경이란?";
const DESCRIPTION =
  "일산서울내과의원 수면 위 내시경 안내. 잠이 든 상태에서 5~10분간 검사하여 불편감을 줄이고, 검사 중 촬영한 영상으로 당일 결과를 함께 확인합니다. 전날 저녁 9시부터 금식, 예약제로 운영됩니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

/** 카드별 강조색 — 파랑·청록 계열 안에서만 변주합니다 */
const ACCENTS = ["#1a3a6c", "#2b5ba8", "#2f9fc4", "#2e9580", "#4bb89c", "#3f6fb5"];

export default function EndoscopyPage() {
  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [
            { name: "수면 위내시경", url: PATH },
            { name: TITLE, url: PATH },
          ],
          medical: true,
          about: { type: "MedicalProcedure", name: "수면 위내시경" },
          faq: toFaqPairs(ENDOSCOPY_FAQ.slice(0, 5)),
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="SEDATION ENDOSCOPY · 수면 위 내시경"
          title={
            <>
              불편해서 미뤄 온 검사,
              <br />
              <em>잠든 사이</em>에 끝냅니다
            </>
          }
          sub={
            <>
              수면 위 내시경은 환자가 잠이 든 상태에서 5분에서 10분간 진행하는
              검사입니다.
              <br />
              검사 중 촬영한 영상으로 결과를 함께 보며 설명해 드립니다.
            </>
          }
          cards={
            <>
              <HeroInfoCard icon="clock" label="총 소요시간" delay="d2">
                1시간 ~ 1시간 30분
              </HeroInfoCard>
              <HeroInfoCard icon="meal" label="금식" teal delay="d3">
                전날 저녁 9시부터
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="예약" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question="수면 위 내시경은 어떤 검사인가요?"
            facts={[
              "검사 시간 5~10분",
              "총 소요 1시간~1시간 30분",
              "당일 영상으로 결과 확인",
              "예약제 운영",
            ]}
          >
            수면 위 내시경은 수면 유도제를 사용해 환자가 잠이 든 상태에서
            시행하는 위 내시경 검사입니다. 일산서울내과의원에서는 검사 전 심장
            상태·혈압·경련성 질환 과거력·호흡기계 질환을 확인한 뒤 금기사항이
            없으면 시행하며, 검사 중 촬영한 영상으로 수면에서 깬 뒤 결과를 함께
            확인하고 상담해 드립니다.
          </KeyAnswer>
        </Section>

        <Section tightTop>
          <IntroBox
            title="위 식도 내시경 검사"
            en="GASTROSCOPY"
            paragraphs={ENDOSCOPY_INTRO.map((paragraph, index) => (
              <span key={index}>{paragraph}</span>
            ))}
          />
        </Section>

        {/* 검사 진행 순서 */}
        <Section alt>
          <SectionHeader
            eyebrow="PROCESS"
            title="검사는 이렇게 진행됩니다"
            desc="준비부터 결과 확인까지, 순서를 미리 알고 오시면 훨씬 마음이 편안합니다."
          />

          <div className="sp_feat_grid">
            {ENDOSCOPY_STEPS.map((step, index) => (
              <div
                className={`eum_rv d${Math.min(index + 2, 5)} sp_feat_card`}
                key={step.step}
                data-step={step.step}
                data-accent=""
                style={
                  {
                    "--accent": ACCENTS[index % ACCENTS.length],
                  } as React.CSSProperties
                }
              >
                <span className="sp_feat_num">{step.step}</span>
                <h3 className="sp_feat_title">{step.title}</h3>
                <p className="sp_feat_desc">{step.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 준비사항 */}
        <Section narrow>
          <SectionHeader
            eyebrow="PREPARATION"
            title="검사 전 준비사항"
            desc="아래 내용만 지켜 주시면 검사가 훨씬 수월합니다."
          />

          <SummaryBox
            title="검사 전 꼭 확인해 주세요"
            items={[
              "내시경은 최소 12시간 이상 완전 공복이 필요합니다. 전날 저녁 7시에 간단히 식사하신 뒤 공복을 유지해 주세요.",
              "전날 저녁 9시부터는 물, 담배, 음식, 약물을 모두 금해 주세요.",
              "아침에 1회 혈압약을 드시는 고혈압 환자분은 혈압약을 전날 저녁 7시에 한 번 더 복용하고 내원해 주세요.",
              "당뇨 환자분은 추가 당뇨약 복용 없이 그대로 내원해 주세요.",
              "검사 당일에는 장거리 운전이나 과로한 일을 피할 수 있도록 일정을 잡아 주세요.",
            ]}
          />

          <Note title="이런 분은 수면 내시경을 권하지 않습니다" navy>
            수면 위 내시경은 15세부터 70세까지 가능하며, 진찰상 전신 상태가
            쇠약하거나 뇌수술·경련 등의 기왕력이 있는 분은 수면 내시경을 받지
            않는 것이 좋습니다. 자세한 사항은 검사 전 진찰에서 확인해 드립니다.
          </Note>
        </Section>

        {/* 안전 · 소독 */}
        <Section alt>
          <SectionHeader
            eyebrow="SAFETY"
            title="안전하게, 그리고 깨끗하게"
            desc="검사를 망설이게 하는 두 가지 걱정에 대해 먼저 말씀드립니다."
          />

          <div className="sp_str_cards">
            <div className="eum_rv d2 sp_str_card">
              <div className="sp_str_icon">
                <Icon name="heart" />
              </div>
              <div className="sp_str_body">
                <h3 className="sp_str_title">수면 유도제는 적은 양으로</h3>
                <p className="sp_str_desc">
                  일산서울내과의원은 수면 유도제를 일반적으로 인식되어 있는
                  안전한 양의 1/2 정도로 적은 양을 사용하며, 응급상황 발생 시
                  대처할 수 있는 기구 설치가 모두 되어 있습니다.
                </p>
              </div>
            </div>
            <div className="eum_rv d3 sp_str_card">
              <div className="sp_str_icon">
                <Icon name="drop" />
              </div>
              <div className="sp_str_body">
                <h3 className="sp_str_title">학회 권장 소독 과정 준수</h3>
                <p className="sp_str_desc">
                  대한소화기내시경학회에서 권장하는 소독 과정을 그대로 준수하며
                  자동소독기를 사용합니다. 소독 시간을 지키기 위해 한 시간
                  간격으로 한 분씩만 검사를 진행합니다.
                </p>
              </div>
            </div>
            <div className="eum_rv d4 sp_str_card">
              <div className="sp_str_icon">
                <Icon name="chat" />
              </div>
              <div className="sp_str_body">
                <h3 className="sp_str_title">동의 없이는 진행하지 않습니다</h3>
                <p className="sp_str_desc">
                  수면 유도제로 잠이 들지 않는 경우 무리하게 더 주사하지 않고,
                  충분한 설명과 동의를 구한 뒤 일반내시경으로 시행합니다.
                  동의하지 않으시면 내시경을 진행하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ 안내 */}
        <Section narrow>
          <SectionHeader
            eyebrow="FAQ"
            title="더 궁금하신 점이 있으신가요?"
            desc="연령대, 소요 시간, 금식, 복용 중인 약까지 자주 묻는 10가지 질문을 정리했습니다."
          />
          <div className="eum_rv d2" style={{ textAlign: "center" }}>
            <Link href="/endoscopy/faq" className="sp_pill lg">
              수면 위 내시경 FAQ 10문항 보기 →
            </Link>
          </div>
        </Section>

        <SubCta
          title={
            <>
              내시경 예약은
              <br />
              전화로 해 주세요
            </>
          }
          sub="소독 과정을 지키기 위해 한 시간 간격으로 한 분씩만 검사합니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="자주 묻는 질문 보기 →"
          secondaryHref="/endoscopy/faq"
        />
      </SubPage>
    </>
  );
}
