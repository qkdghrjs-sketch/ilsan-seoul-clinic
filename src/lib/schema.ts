import { CLINIC, CLINIC_ID, SITE_URL } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";

/**
 * JSON-LD 구조화 데이터 생성기.
 * 구글·네이버뿐 아니라 AI 모델이 "여기가 어떤 병원이고 누가 진료하는지"를
 * 정확히 파악하도록 돕습니다.
 */

/** 원장 정보 — 병원 정보에서 참조합니다. */
export const DOCTOR_ID = `${SITE_URL}/doctor#person`;

export function doctorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": DOCTOR_ID,
    name: `${CLINIC.founder} 원장`,
    givenName: CLINIC.founder,
    jobTitle: DOCTOR.position,
    medicalSpecialty: ["내과", "소화기내시경"],
    url: `${SITE_URL}/doctor`,
    worksFor: { "@id": CLINIC_ID },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "이화여자대학교 의과대학",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "전문의",
        name: "내과 전문의 (이화여자대학교 부속병원, 1994)",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "전문의",
        name: "소화기내시경 전문의 (1999)",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "학위",
        name: "의학박사 (1996)",
      },
    ],
    award: DOCTOR.awards.map((item) => `${item.year} ${item.text}`),
  };
}

/** 병원 자체 정보 — 모든 페이지에 공통으로 삽입 */
export function clinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": CLINIC_ID,
    name: CLINIC.name,
    alternateName: CLINIC.shortName,
    description: CLINIC.description,
    url: SITE_URL,
    telephone: CLINIC.telephone,
    priceRange: "₩₩",
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC.address.street,
      addressLocality: CLINIC.address.locality,
      addressRegion: CLINIC.address.region,
      addressCountry: CLINIC.address.country,
    },
    medicalSpecialty: [...CLINIC.medicalSpecialty],
    founder: { "@id": DOCTOR_ID },
    employee: [{ "@id": DOCTOR_ID }],
    isAcceptingNewPatients: true,
    currenciesAccepted: "KRW",
    paymentAccepted: "현금, 신용카드, 건강보험",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Thursday", "Saturday"],
        opens: "09:00",
        closes: "13:00",
      },
    ],
    availableService: [
      { "@type": "MedicalProcedure", name: "수면 위내시경" },
      { "@type": "MedicalTest", name: "고혈압 정기검사" },
      { "@type": "MedicalTest", name: "당뇨병 정기검사" },
      { "@type": "MedicalTest", name: "B형간염 정기검사" },
      { "@type": "MedicalTest", name: "국민건강보험공단 건강검진" },
      { "@type": "MedicalTest", name: "정밀종합검사" },
    ],
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
