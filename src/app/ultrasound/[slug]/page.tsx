import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import {
  SubPage,
  SubHero,
  Section,
  SectionHeader,
  SummaryBox,
  Gallery,
} from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
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
          blue
          eyebrow={`${item.eyebrow} · ${item.label}`}
          title={
            <>
              {item.label},
              <br />
              <em>원장이 직접</em> 검사합니다
            </>
          }
          sub={item.heroSub}
        />

        {/* 원장님 요청(2026-10-27): 한 줄 답변·「이런 점을 확인합니다」·검사 전 안내·전화 상자 삭제 */}
        <Section>
          <SectionHeader eyebrow="EXAMPLE" title="검사 화면 예시" />
          <Gallery items={item.images} />
          <SummaryBox
            title={`${item.label}로 살펴보는 내용`}
            items={item.points}
          />
          <p className="eum_rv d2 sp_disclaimer">
            검사 화면은 개인 식별정보를 제외한 예시이며, 검사 방법과 결과
            해석은 개인의 건강 상태에 따라 달라질 수 있습니다.
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
      </SubPage>
    </>
  );
}
