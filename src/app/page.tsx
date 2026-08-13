import type { Metadata } from "next";

import {
  HomeHero,
  HomeStats,
  HomeServices,
  HomeDoctor,
  HomeCheckups,
  HomeCta,
} from "@/components/home/HomeSections";
import LocationSection from "@/components/layout/LocationSection";
import JsonLd from "@/components/JsonLd";
import { CORE_ANSWERS } from "@/lib/core-answers";
import { doctorSchema } from "@/lib/schema";
import {
  CLINIC,
  CLINIC_ID,
  CONTENT_UPDATED,
  SITE_PUBLISHED,
  SITE_URL,
} from "@/lib/site";

const PAGE_TITLE = `${CLINIC.name} | 일산 주엽동 내과 · 수면 위내시경`;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description:
    "고양시 일산서구 주엽동 일산서울내과의원입니다. 1989년 이화여자대학교 의과대학을 졸업하고 30년 이상 내과 진료를 이어온 김금미 원장이 수면 위내시경, 고혈압·당뇨병·B형간염 정기검사, 국민건강보험공단 검진, 정밀종합검사를 직접 시행합니다.",
  alternates: { canonical: "/" },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "30년 진료 경력의 여의사 원장이 직접 진료합니다. 주엽역 인근 일산서울내과의원 — 수면 위내시경과 각종 검사 안내.",
    url: "/",
    type: "website",
  },
};

/**
 * 첫 화면의 구조화 데이터.
 *
 * AI가 병원을 인용할 때 가장 먼저 집는 주소가 첫 화면입니다.
 * "이 페이지가 무엇인가(WebPage)"와 "자주 묻는 질문(FAQPage)"을 함께 실어,
 * 첫 화면만 읽고 지나가는 AI도 정확한 답을 얻을 수 있게 합니다.
 */
function homeSchemas() {
  const featured = CORE_ANSWERS.slice(0, 8);

  return [
    doctorSchema(),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      name: PAGE_TITLE,
      description: CLINIC.description,
      url: `${SITE_URL}/`,
      inLanguage: "ko-KR",
      isPartOf: { "@id": CLINIC_ID },
      publisher: { "@id": CLINIC_ID },
      about: { "@id": CLINIC_ID },
      datePublished: SITE_PUBLISHED,
      dateModified: CONTENT_UPDATED,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".hm_hero_title", ".hm_hero_sub"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      inLanguage: "ko-KR",
      mainEntity: featured.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];
}

export default function HomePage() {
  return (
    <div className="hm">
      <JsonLd data={homeSchemas()} />
      <HomeHero />
      <HomeStats />
      <HomeServices />
      <HomeDoctor />
      <HomeCheckups />
      <LocationSection />
      <HomeCta />
    </div>
  );
}
