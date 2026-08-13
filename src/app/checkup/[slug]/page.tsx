import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
import { CHECKUPS, findCheckup } from "@/lib/checkups";

/** 고혈압 · 당뇨병 · B형간염 정기검사 페이지 (구성이 같아 한 틀로 그립니다) */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CHECKUPS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const checkup = findCheckup(slug);
  if (!checkup) return {};

  return {
    title: checkup.title,
    description: checkup.description,
    alternates: { canonical: checkup.path },
    openGraph: {
      title: checkup.title,
      description: checkup.description,
      url: checkup.path,
    },
  };
}

export default async function CheckupDetailPage({ params }: Params) {
  const { slug } = await params;
  const checkup = findCheckup(slug);
  if (!checkup) notFound();

  const totalItems = checkup.groups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: checkup.path,
          name: checkup.title,
          description: checkup.description,
          breadcrumb: [
            { name: "검사안내", url: "/checkup" },
            { name: checkup.label, url: checkup.path },
          ],
          medical: true,
          about: { type: "MedicalTest", name: checkup.title },
          faq: [{ q: checkup.answerQ, a: checkup.answerA }],
        })}
      />
      <SubPageHeader currentPath={checkup.path} />

      <SubPage>
        <SubHero
          eyebrow={`${checkup.eyebrow} · ${checkup.label}`}
          title={
            <>
              지금 잘 관리되고 있는지,
              <br />
              <em>{checkup.cycle}</em> 확인합니다
            </>
          }
          sub={checkup.heroSub}
          cards={
            <>
              <HeroInfoCard icon="clock" label="검사 주기" delay="d2">
                {checkup.cycle}
              </HeroInfoCard>
              <HeroInfoCard icon={checkup.icon} label="검사 항목" teal delay="d3">
                총 {totalItems}개 항목
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="검사 문의" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop narrow>
          <KeyAnswer
            question={checkup.answerQ}
            facts={[checkup.cycle, `검사 항목 ${totalItems}개`, "원장 직접 시행"]}
          >
            {checkup.answerA}
          </KeyAnswer>
        </Section>

        <Section tightTop narrow>
          <SectionHeader
            eyebrow="WHY"
            title="왜 정기적으로 확인해야 할까요"
            left
          />
          <div className="eum_rv d2 sp_prose">
            {checkup.intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Section>

        <Section alt>
          <SectionHeader
            eyebrow="TEST ITEMS"
            title={`${checkup.label} 검사 내용`}
            desc="아래 항목을 함께 확인하여 약의 조절 상태와 합병증 여부를 살핍니다."
          />

          <div className="sp_trt_grid">
            {checkup.groups.map((group, index) => (
              <div
                className={`eum_rv d${Math.min(index + 2, 5)} sp_trt_card`}
                key={group.label}
              >
                <div className="sp_deco" />
                <div className="sp_trt_icon">
                  <Icon name={checkup.icon} />
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

        <Section narrow>
          <Note title="검사 전 안내" navy>
            혈액검사와 복부 초음파는 공복이 필요할 수 있습니다. 검사 예약 시
            식사·복약과 관련된 준비사항을 미리 안내해 드리니, 복용 중인 약이
            있다면 알려 주세요.
          </Note>
          <p className="eum_rv d2 sp_disclaimer">
            위 내용은 일반적인 안내이며, 개인의 건강 상태와 치료 경과에 따라
            검사 항목과 주기가 달라질 수 있습니다.
          </p>
        </Section>

        <SubCta
          title={
            <>
              {checkup.label},
              <br />
              전화로 예약하실 수 있습니다
            </>
          }
          sub="검사 결과는 원장이 직접 확인하고 설명해 드립니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="다른 검사 보기 →"
          secondaryHref="/checkup"
        />
      </SubPage>
    </>
  );
}
