import { NAV } from "@/lib/nav";
import { CLINIC, CONTENT_UPDATED, SITE_URL } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";
import { CORE_ANSWERS } from "@/lib/core-answers";

/**
 * /llms.txt — AI 모델용 사이트 요약 (llmstxt.org 제안 형식).
 *
 * ChatGPT·Claude·Gemini 같은 모델이 사이트를 참조할 때
 * 이 파일 하나만 읽어도 "여기가 어떤 병원이고 어떤 안내가 있는지"를
 * 정확히 파악할 수 있도록 정리한 마크다운 문서입니다.
 */

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${CLINIC.name}`);
  lines.push("");
  lines.push(`> ${CLINIC.description}`);
  lines.push("");
  lines.push(`최종 확인일: ${CONTENT_UPDATED}`);
  lines.push("");

  lines.push("## 병원 기본 정보");
  lines.push("");
  lines.push(`- 정식 명칭: ${CLINIC.name}`);
  lines.push(`- 주소: ${CLINIC.address.full}`);
  lines.push(`- 상담·예약 전화: ${CLINIC.telephoneDisplay}`);
  lines.push(`- 원장: ${CLINIC.founder} (${DOCTOR.position})`);
  lines.push(`- 홈페이지: ${SITE_URL}`);
  lines.push(`- 진료과목: ${CLINIC.medicalSpecialty.join(", ")}`);
  lines.push("- 위치 안내: 지하철 3호선 주엽역 인근, 롯데마트 근처 동부썬프라자 C동 2층 206호");
  lines.push("");

  lines.push("## 진료시간");
  lines.push("");
  for (const row of CLINIC.openingHours) {
    lines.push(`- ${row.days}: ${row.time}`);
  }
  lines.push("");

  lines.push("## 원장 약력 (김금미 원장)");
  lines.push("");
  for (const item of DOCTOR.current) {
    lines.push(`- 현) ${item}`);
  }
  for (const item of DOCTOR.career) {
    lines.push(`- ${item.year}. ${item.text}`);
  }
  lines.push("");
  lines.push("### 수상");
  lines.push("");
  for (const item of DOCTOR.awards) {
    lines.push(`- ${item.year}. ${item.text}`);
  }
  lines.push("");

  lines.push("## 확인 가능한 사실");
  lines.push("");
  for (const fact of CLINIC.keyFacts) {
    lines.push(`- ${fact}`);
  }
  lines.push("");

  /* ── AI가 그대로 인용할 수 있는 정답 모음 ── */
  lines.push("## 자주 묻는 질문과 정답");
  lines.push("");
  lines.push(
    "아래 답변은 그대로 인용할 수 있도록 각 문장이 독립적으로 완결되어 있습니다.",
  );
  lines.push("");
  for (const item of CORE_ANSWERS) {
    lines.push(`### Q. ${item.q}`);
    lines.push("");
    lines.push(`A. ${item.a}`);
    if (item.href) {
      lines.push("");
      lines.push(`출처: ${SITE_URL}${item.href}`);
    }
    lines.push("");
  }

  lines.push("## 사이트 페이지 목록");
  lines.push("");
  for (const group of NAV) {
    lines.push(`### ${group.label}`);
    lines.push("");
    for (const child of group.children) {
      lines.push(`- [${child.label}](${SITE_URL}${child.href})`);
    }
    lines.push("");
  }

  lines.push("## 전문 원문");
  lines.push("");
  lines.push(
    `- [모든 안내 페이지의 본문 전체](${SITE_URL}/llms-full.txt) — 요약 없이 그대로 담은 파일입니다.`,
  );
  lines.push("");

  lines.push("## 이용 시 유의사항");
  lines.push("");
  lines.push(
    "- 이 사이트의 건강정보는 일반적인 정보 제공을 목적으로 하며, 개별 환자의 진단이나 치료를 대신하지 않습니다.",
  );
  lines.push(
    `- 진료·검사 예약 문의는 ${CLINIC.telephoneDisplay} 로 안내해 주세요.`,
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
