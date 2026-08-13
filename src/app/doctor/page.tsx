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
              <span className="eum_rv d2 sp_quote_line" />
              <p className="eum_rv d2 sp_quote_text">
                {DOCTOR.quote[0]}
                <br />
                {DOCTOR.quote[1]}
              </p>
              <p className="eum_rv d3 sp_quote_attr">{DOCTOR.name}</p>
            </div>
            <div className="eum_rv d3 sp_quote_box">
              <p className="sp_quote_sub">
                내시경이든 정기검사든, 검사는 받는 것으로 끝나지 않습니다.
                일산서울내과의원은 원장이 직접 검사를 시행하고, 그 결과를 함께
                보면서 무엇을 확인했고 앞으로 무엇을 살펴야 하는지 충분히
                설명해 드립니다.
              </p>
              <p className="sp_quote_sub">
                검사 결과에 따라 필요한 치료까지 같은 곳에서 이어서 받으실 수
                있도록 진료합니다.
              </p>
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
                <Icon name="user" />
                <span className="sp_career_label">현재</span>
              </div>
              <div className="sp_timeline">
                {DOCTOR.current.map((item) => (
                  <div className="eum_rv d2 sp_tl_item" key={item}>
                    <span className="sp_tl_dot" />
                    <span className="sp_tl_text">현) {item}</span>
                  </div>
                ))}
              </div>

              <div className="eum_rv d2 sp_career_cat">
                <Icon name="cap" />
                <span className="sp_career_label">학력 · 수련</span>
              </div>
              <div className="sp_timeline">
                {DOCTOR.career.map((item) => (
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
                <Icon name="checkCircle" />
                <span className="sp_career_label">수상</span>
              </div>
              <div className="sp_timeline">
                {DOCTOR.awards.map((item) => (
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

              <div className="eum_rv d2 sp_career_cat">
                <Icon name="pulse" />
                <span className="sp_career_label">진료 분야</span>
              </div>
              <div className="sp_cred_bar">
                {[
                  { eyebrow: "ENDOSCOPY", label: "수면 위내시경" },
                  { eyebrow: "CHECK-UP", label: "고혈압·당뇨병 정기검사" },
                  { eyebrow: "CHECK-UP", label: "B형간염 정기검사" },
                  { eyebrow: "NATIONAL", label: "국민건강보험공단 검진" },
                  { eyebrow: "PREMIUM", label: "정밀종합검사" },
                ].map((item) => (
                  <div className="eum_rv d3 sp_cred_item" key={item.label}>
                    <div className="sp_cred_icon">
                      <Icon name="check" />
                    </div>
                    <div>
                      <span className="sp_info_label">{item.eyebrow}</span>
                      <span className="sp_cred_label">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
