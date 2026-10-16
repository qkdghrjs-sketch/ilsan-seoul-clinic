import type { Metadata } from "next";
import Link from "next/link";
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
  SummaryBox,
  Gallery,
  Note,
  SubCta,
} from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { ULTRASOUNDS, findUltrasound } from "@/lib/ultrasound";

/** 심장 · 갑상선 · 경동맥 · 복부 초음파 페이지 (구성이 같아 한 틀로 그립니다) */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ULTRASOUNDS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = findUltrasound(slug);
  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: item.path },
    openGraph: {
      title: item.title,
      description: item.description,
      url: item.path,
    },
  };
}

export default async function UltrasoundDetailPage({ params }: Params) {
  const { slug } = await params;
  const item = findUltrasound(slug);
  if (!item) notFound();

  const others = ULTRASOUNDS.filter((other) => other.slug !== item.slug);

  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: item.path,
          name: item.title,
          description: item.description,
          breadcrumb: [
            { name: "초음파검사", url: "/ultrasound" },
            { name: item.label, url: item.path },
          ],
          medical: true,
          about: { type: "MedicalTest", name: item.label },
          faq: [{ q: item.answerQ, a: item.answerA }],
        })}
      />
      <SubPageHeader currentPath={item.path} />

      <SubPage>
        <SubHero
          eyebrow={`${item.eyebrow} · ${item.label}`}
          title={
            <>
              {item.label},
              <br />
              <em>원장이 직접</em> 검사합니다
            </>
          }
          sub={item.heroSub}
          cards={
            <>
              <HeroInfoCard icon={item.icon} label="확인하는 내용" delay="d2">
                {item.summary}
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
            question={item.answerQ}
            facts={["원장 직접 시행", "결과 직접 설명", `예약 문의 ${CLINIC.telephoneDisplay}`]}
          >
            {item.answerA}
          </KeyAnswer>
        </Section>

        <Section narrow>
          <SectionHeader
            eyebrow="WHAT WE CHECK"
            title="이런 점을 확인합니다"
            desc={item.summary}
          />
          <SummaryBox
            title={`${item.label}으로 살펴보는 내용`}
            items={item.points}
          />
        </Section>

        <Section alt>
          <SectionHeader
            eyebrow="EXAMPLE"
            title="검사 화면 예시"
            desc="실제 검사 화면의 예시입니다. 검사 결과는 사람마다 다릅니다."
          />
          <Gallery items={item.images} />
          <p className="sp_gallery_note">
            개인 식별정보는 제외한 화면이며, 검사 소견은 개인의 상태에 따라
            다르게 나타날 수 있습니다.
          </p>
        </Section>

        <Section narrow tightTop>
          <Note title="검사 전 안내" navy>
            검사 부위와 몸 상태에 따라 공복이 필요할 수 있습니다. 예약하실 때
            준비사항을 미리 안내해 드리니, 복용 중인 약이 있다면 알려 주세요.
          </Note>
          <p className="eum_rv d2 sp_disclaimer">
            위 내용은 일반적인 안내이며, 개인의 건강 상태에 따라 검사 방법과
            결과 해석이 달라질 수 있습니다.
          </p>
          <div
            className="eum_rv d3"
            style={{ textAlign: "center", marginTop: 24 }}
          >
            {others.map((other) => (
              <Link
                key={other.slug}
                href={other.path}
                className="sp_pill"
                style={{ margin: "4px" }}
              >
                {other.label}
              </Link>
            ))}
          </div>
        </Section>

        <SubCta
          title={
            <>
              {item.label},
              <br />
              전화로 예약하실 수 있습니다
            </>
          }
          sub="검사 결과는 원장이 직접 확인하고 설명해 드립니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="초음파검사 전체 보기 →"
          secondaryHref="/ultrasound"
        />
      </SubPage>
    </>
  );
}
