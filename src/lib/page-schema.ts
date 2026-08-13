import { isValidElement, type ReactNode } from "react";
import {
  CLINIC,
  CLINIC_ID,
  CONTENT_UPDATED,
  SITE_PUBLISHED,
  SITE_URL,
} from "@/lib/site";

/**
 * JSX로 작성한 FAQ 답변을 구조화 데이터용 평문으로 변환합니다.
 * 답변이 화면에만 보이고 JSON-LD에서는 비어버리는 일을 막기 위한 장치입니다.
 */
export function reactToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(reactToText).join(" ");
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return reactToText(props.children);
  }
  return "";
}

/** FAQ 목록을 구조화 데이터용 { q, a } 배열로 변환 */
export function toFaqPairs(
  items: Array<{ q: string; a: ReactNode }>,
): FaqPair[] {
  return items
    .map((item) => ({
      q: item.q,
      a: reactToText(item.a).replace(/\s+/g, " ").trim(),
    }))
    .filter((pair) => pair.a.length > 0);
}

/**
 * 세부페이지용 구조화 데이터 묶음.
 *
 * 페이지마다 WebPage(또는 MedicalWebPage) + BreadcrumbList + FAQPage 를
 * 한 번에 만들어 검색엔진·AI가 페이지의 성격과 위치를 정확히 이해하도록 합니다.
 */

export type Crumb = { name: string; url: string };
export type FaqPair = { q: string; a: string };

export function pageSchemas({
  path,
  name,
  description,
  breadcrumb,
  faq,
  medical = false,
  about,
}: {
  path: string;
  name: string;
  description: string;
  breadcrumb: Crumb[];
  faq?: FaqPair[];
  /** 질환·치료 설명 페이지는 MedicalWebPage 로 표시합니다. */
  medical?: boolean;
  /** 이 페이지가 다루는 질환·시술·검사 이름 */
  about?: {
    type: "MedicalCondition" | "MedicalProcedure" | "MedicalTest";
    name: string;
  };
}) {
  const url = `${SITE_URL}${path}`;

  const page: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": medical ? "MedicalWebPage" : "WebPage",
    "@id": `${url}#page`,
    name: `${name} | ${CLINIC.name}`,
    description,
    url,
    inLanguage: "ko-KR",
    isPartOf: { "@id": CLINIC_ID },
    publisher: { "@id": CLINIC_ID },
    about: about
      ? { "@type": about.type, name: about.name }
      : { "@id": CLINIC_ID },
    /**
     * 언제 확인된 정보인지 알려 줍니다.
     * AI는 오래된 정보를 인용하지 않으려 하므로, 이 값이 없으면
     * 내용이 정확해도 "확인할 수 없는 정보"로 밀려납니다.
     */
    datePublished: SITE_PUBLISHED,
    dateModified: CONTENT_UPDATED,
    /**
     * 음성 비서(구글 어시스턴트·시리 등)가 소리 내어 읽을 부분.
     * 페이지 첫머리의 제목과 핵심 답변 문단을 지정합니다.
     */
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".sp_hero_title", ".sp_answer_q", ".sp_answer_a"],
    },
  };

  if (medical) {
    page.audience = { "@type": "MedicalAudience", audienceType: "Patient" };
    page.reviewedBy = {
      "@type": "Person",
      name: `${CLINIC.founder} 원장`,
      jobTitle: "내과 전문의 · 소화기내시경 전문의",
      affiliation: { "@id": CLINIC_ID },
    };
  }

  const schemas: object[] = [page];

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: CLINIC.shortName,
        item: SITE_URL,
      },
      ...breadcrumb.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.name,
        item: `${SITE_URL}${crumb.url}`,
      })),
    ],
  });

  const validFaq = (faq ?? []).filter((pair) => pair.q && pair.a);
  if (validFaq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: validFaq.map((pair) => ({
        "@type": "Question",
        name: pair.q,
        acceptedAnswer: { "@type": "Answer", text: pair.a },
      })),
    });
  }

  return schemas;
}
