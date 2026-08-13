import { CLINIC, CONTENT_UPDATED, SITE_URL } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";
import { ENDOSCOPY_INTRO, ENDOSCOPY_STEPS, ENDOSCOPY_FAQ } from "@/lib/endoscopy";
import { CHECKUPS, NHIS_SECTIONS, PREMIUM_GROUPS } from "@/lib/checkups";
import { reactToText } from "@/lib/page-schema";

/**
 * /llms-full.txt — 사이트의 모든 안내 내용을 요약 없이 담은 평문 문서.
 *
 * AI가 화면을 해석하지 않고도 병원 안내 전체를 정확히 읽어 갈 수 있습니다.
 */

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${CLINIC.name} — 전체 안내 원문`);
  lines.push("");
  lines.push(`> ${CLINIC.description}`);
  lines.push("");
  lines.push(`- 주소: ${CLINIC.address.full}`);
  lines.push(`- 상담·예약: ${CLINIC.telephoneDisplay}`);
  lines.push(`- 홈페이지: ${SITE_URL}`);
  lines.push(`- 최종 확인일: ${CONTENT_UPDATED}`);
  lines.push("");

  /* ── 진료시간 ── */
  lines.push("## 진료시간");
  lines.push("");
  for (const row of CLINIC.outpatientRows) {
    lines.push(`- ${row.label}: ${row.value}`);
  }
  lines.push("");

  /* ── 원장 소개 ── */
  lines.push("## 원장님 소개");
  lines.push("");
  lines.push(`${DOCTOR.name} — ${DOCTOR.position}`);
  lines.push("");
  lines.push("### 현재");
  lines.push("");
  for (const item of DOCTOR.current) lines.push(`- 현) ${item}`);
  lines.push("");
  lines.push("### 약력");
  lines.push("");
  for (const item of DOCTOR.career) lines.push(`- ${item.year}. ${item.text}`);
  lines.push("");
  lines.push("### 수상");
  lines.push("");
  for (const item of DOCTOR.awards) lines.push(`- ${item.year}. ${item.text}`);
  lines.push("");

  /* ── 수면 위 내시경 ── */
  lines.push("## 수면 위 내시경이란?");
  lines.push("");
  for (const paragraph of ENDOSCOPY_INTRO) {
    lines.push(paragraph);
    lines.push("");
  }
  lines.push("### 검사 진행 순서");
  lines.push("");
  for (const step of ENDOSCOPY_STEPS) {
    lines.push(`${step.step}. ${step.title} — ${step.text}`);
  }
  lines.push("");

  lines.push("## 수면 위 내시경 자주 묻는 질문");
  lines.push("");
  ENDOSCOPY_FAQ.forEach((item, index) => {
    lines.push(`### ${index + 1}. ${item.q}`);
    lines.push("");
    lines.push(reactToText(item.a).replace(/\s+/g, " ").trim());
    lines.push("");
  });

  /* ── 검사안내 ── */
  lines.push("## 검사안내");
  lines.push("");
  for (const checkup of CHECKUPS) {
    lines.push(`### ${checkup.title}`);
    lines.push("");
    lines.push(checkup.answerA);
    lines.push("");
    for (const paragraph of checkup.intro) {
      lines.push(paragraph);
      lines.push("");
    }
    lines.push(`검사 주기: ${checkup.cycle}`);
    lines.push("");
    lines.push("검사 내용:");
    for (const group of checkup.groups) {
      lines.push(`- ${group.label}: ${group.items.join(" / ")}`);
    }
    lines.push("");
    lines.push(`출처: ${SITE_URL}${checkup.path}`);
    lines.push("");
  }

  /* ── 국민공단검진 ── */
  lines.push("### 국민공단검진");
  lines.push("");
  lines.push(
    "일산서울내과의원 원장이 직접 검사하고 결과를 확인하여 실제 치료까지 이어서 받으실 수 있도록 진행합니다.",
  );
  lines.push("");
  for (const section of NHIS_SECTIONS) {
    lines.push(`#### ${section.no}. ${section.title}`);
    lines.push("");
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph);
      lines.push("");
    }
    lines.push(`검사 종목: ${section.items.join(" / ")}`);
    lines.push("");
  }
  lines.push(`출처: ${SITE_URL}/checkup/nhis`);
  lines.push("");

  /* ── 정밀종합검사 ── */
  lines.push("### 정밀종합검사");
  lines.push("");
  for (const group of PREMIUM_GROUPS) {
    lines.push(`- ${group.label}: ${group.items.join(" / ")}`);
  }
  lines.push("");
  lines.push(`출처: ${SITE_URL}/checkup/premium`);
  lines.push("");

  /* ── 오시는 길 ── */
  lines.push("## 찾아오시는 길");
  lines.push("");
  lines.push(`- 주소: ${CLINIC.address.full}`);
  for (const row of CLINIC.transit) {
    lines.push(`- ${row.label}: ${row.text}`);
  }
  for (const notice of CLINIC.locationNotices) {
    lines.push(`- ${notice.replace(/^ㆍ/, "")}`);
  }
  lines.push("");

  lines.push("## 이용 시 유의사항");
  lines.push("");
  lines.push(
    "- 이 문서의 건강정보는 일반적인 정보 제공을 목적으로 하며, 개별 환자의 진단이나 치료를 대신하지 않습니다.",
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
