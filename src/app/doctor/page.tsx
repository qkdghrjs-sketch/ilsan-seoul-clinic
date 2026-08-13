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
  SubCta,
} from "@/components/subpage/parts";
import Icon from "@/components/subpage/icons";
import { pageSchemas } from "@/lib/page-schema";
import { doctorSchema } from "@/lib/schema";
import { CLINIC } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";

const PATH = "/doctor";
const TITLE = "원장님 소개";
const DESCRIPTION =
  "일산서울내과의원 김금미 원장 소개. 1989년 이화여자대학교 의과대학 졸업, 1994년 이화여자대학교 부속병원 내과전문의 수료, 1996년 의학박사, 1999년 소화기내시경 전문의 수료. 현재 이대의대 외래교수·국제보건의료재단 자문의.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

export default function DoctorPage() {
  return (
    <>
      <JsonLd
        data={[
          doctorSchema(),
          ...pageSchemas({
            path: PATH,
            name: `${DOCTOR.name} 소개`,
            description: DESCRIPTION,
            breadcrumb: [
              { name: "본원소개", url: PATH },
              { name: TITLE, url: PATH },
            ],
          }),
        ]}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="OUR DOCTOR"
          title={
            <>
              30년 이상 내과 진료를 이어온
              <br />
              <strong>{DOCTOR.name}</strong>
            </>
          }
          sub={
            <>
              1989년 이화여자대학교 의과대학을 졸업하고 1994년 이화여자대학교
              부속병원에서 내과전문의 과정을 수료했습니다.
              <br />
              1999년 소화기내시경 전문의 과정을 마친 뒤, 수면 위내시경과 각종
              검사를 직접 시행하고 있습니다.
            </>
          }
          badges={DOCTOR.tags.map((tag) => tag.label)}
          cards={
            <>
              <HeroInfoCard icon="user" label="진료" delay="d2">
                {DOCTOR.position}
              </HeroInfoCard>
              <HeroInfoCard icon="cap" label="학력" teal delay="d3">
                이화여자대학교 의과대학 졸업 (1989)
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="상담·예약" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question="일산서울내과의원은 어떤 원장님이 진료하나요?"
            facts={[
              "1989년 이화여자대학교 의과대학 졸업",
              "1994년 내과전문의 수료",
              "1999년 소화기내시경 전문의 수료",
              "1996년 의학박사",
            ]}
          >
            일산서울내과의원은 김금미 원장이 진료합니다. 1989년 이화여자대학교
            의과대학을 졸업하고 1994년 이화여자대학교 부속병원에서 내과전문의
            과정을 수료한 뒤, 30년 이상 내과 진료를 이어오고 있는 여의사입니다.
            1996년 의학박사 학위를 받았고 1999년 소화기내시경 전문의 과정을
            수료했으며, 현재 이대의대 외래교수와 국제보건의료재단 자문의를 맡고
            있습니다.
          </KeyAnswer>
        </Section>

        {/* 진료 철학 */}
        <Section alt>
          <div className="sp_quote_grid">
            <div className="sp_quote_left">
              <span className="eum_rv d1 sp_quote_eyebrow">PHILOSOPHY</span>
              <p className="eum_rv d2 sp_quote_line">
                {DOCTOR.quote[0]}
                <br />
                {DOCTOR.quote[1]}
              </p>
              <p className="eum_rv d3 sp_quote_attr">
                <strong>{DOCTOR.name}</strong>
                {DOCTOR.position}
              </p>
            </div>

            <div className="sp_str_cards">
              <div className="eum_rv d2 sp_str_card">
                <div className="sp_str_icon">
                  <Icon name="user" />
                </div>
                <div className="sp_str_body">
                  <h3 className="sp_str_title">원장이 직접 시행합니다</h3>
                  <p className="sp_str_desc">
                    수면 위내시경과 각종 검사를 원장이 직접 시행하고, 결과도
                    직접 확인해 설명해 드립니다.
                  </p>
                </div>
              </div>
              <div className="eum_rv d3 sp_str_card">
                <div className="sp_str_icon">
                  <Icon name="chat" />
                </div>
                <div className="sp_str_body">
                  <h3 className="sp_str_title">결과를 함께 보며 설명합니다</h3>
                  <p className="sp_str_desc">
                    무엇을 확인했고 앞으로 무엇을 살펴야 하는지, 검사 영상을
                    함께 보면서 충분히 말씀드립니다.
                  </p>
                </div>
              </div>
              <div className="eum_rv d4 sp_str_card">
                <div className="sp_str_icon">
                  <Icon name="heart" />
                </div>
                <div className="sp_str_body">
                  <h3 className="sp_str_title">치료까지 이어서 봅니다</h3>
                  <p className="sp_str_desc">
                    검사 결과에 따라 필요한 치료까지 같은 곳에서 이어서 받으실
                    수 있도록 진료합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 약력 */}
        <Section>
          <SectionHeader
            eyebrow="CAREER"
            title="약력"
            desc="병원에서 확인된 경력만 표기합니다."
          />

          <div className="sp_career_flex">
            <div className="sp_career_col">
              <div className="eum_rv d1 sp_career_cat">
                <span
                  className="sp_career_dot"
                  style={{ background: "#1a3a6c" }}
                />
                <span className="sp_career_label" style={{ color: "#1a3a6c" }}>
                  현재
                </span>
              </div>
              <div className="sp_timeline">
                {DOCTOR.current.map((item) => (
                  <div className="eum_rv d2 sp_tl_item" key={item}>
                    <span className="sp_tl_dot" />
                    <span className="sp_tl_text">현) {item}</span>
                  </div>
                ))}
              </div>

              <div
                className="eum_rv d2 sp_career_cat"
                style={{ marginTop: 36 }}
              >
                <span
                  className="sp_career_dot"
                  style={{ background: "#3bae96" }}
                />
                <span className="sp_career_label" style={{ color: "#2e9580" }}>
                  수상
                </span>
              </div>
              <div className="sp_timeline">
                {DOCTOR.awards.map((item) => (
                  <div
                    className="eum_rv d3 sp_tl_item"
                    key={item.year + item.text}
                  >
                    <span className="sp_tl_dot" />
                    <span className="sp_tl_text">
                      <strong>{item.year}.</strong> {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sp_career_col">
              <div className="eum_rv d1 sp_career_cat">
                <span
                  className="sp_career_dot"
                  style={{ background: "#4a90d9" }}
                />
                <span className="sp_career_label" style={{ color: "#2b5ba8" }}>
                  학력 · 수련
                </span>
              </div>
              <div className="sp_timeline">
                {DOCTOR.career.map((item) => (
                  <div
                    className="eum_rv d2 sp_tl_item"
                    key={item.year + item.text}
                  >
                    <span className="sp_tl_dot" />
                    <span className="sp_tl_text">
                      <strong>{item.year}.</strong> {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 진료 분야 */}
        <Section alt narrow>
          <SectionHeader
            eyebrow="SCOPE"
            title="이런 진료를 봅니다"
            desc="원장이 직접 시행하고 결과를 설명해 드리는 항목입니다."
          />
          <div className="eum_rv d2 sp_icon_list">
            {[
              {
                icon: "eye" as const,
                text: "수면 위내시경 — 검사 후 영상으로 결과를 함께 확인",
              },
              {
                icon: "heart" as const,
                text: "고혈압 정기검사 — 6개월마다 약 조절과 합병증 확인",
              },
              {
                icon: "drop" as const,
                text: "당뇨병 정기검사 — 당화혈색소 포함 6개월 정기검사",
              },
              {
                icon: "leaf" as const,
                text: "B형간염 정기검사 — 복부 초음파와 간염 표지자 검사",
              },
              {
                icon: "checkCircle" as const,
                text: "국민건강보험공단 검진 — 일반건강검진 · 위암 · 간암 검진",
              },
              {
                icon: "list" as const,
                text: "정밀종합검사 — 내시경 · 초음파 · 혈액 51종 · 암 표지자",
              },
            ].map((item) => (
              <div className="sp_icon_item" key={item.text}>
                <span className="sp_icon_badge">
                  <Icon name={item.icon} />
                </span>
                <span className="sp_icon_text">{item.text}</span>
              </div>
            ))}
          </div>
        </Section>

        <SubCta
          title={
            <>
              궁금하신 점은
              <br />
              편하게 물어보세요
            </>
          }
          sub="진료·검사 예약은 전화로 안내해 드립니다."
          note={CLINIC.address.full}
          secondaryLabel="찾아오시는 길 →"
          secondaryHref="/location"
        />
      </SubPage>
    </>
  );
}
