import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt
 *
 * 검색엔진뿐 아니라 AI 학습·검색 크롤러를 명시적으로 허용합니다.
 * 이름을 하나씩 적어 두는 이유: 일부 봇은 와일드카드(*) 규칙을 무시하고
 * 자기 이름이 적힌 규칙만 따르기 때문입니다.
 */

/** AI 답변·검색에 이 사이트 내용이 쓰이도록 허용할 크롤러 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI 학습
  "OAI-SearchBot", // ChatGPT 검색
  "ChatGPT-User", // ChatGPT 사용자 요청 브라우징
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended", // Gemini
  "PerplexityBot",
  "Perplexity-User",
  "Applebot-Extended",
  "Bytespider",
  "CCBot", // Common Crawl (대부분의 LLM이 참조)
  "cohere-ai",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
];

/** 일반 검색엔진 */
const SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "Yeti", // 네이버
  "Daumoa", // 다음
  "NaverBot",
];

export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: "/" };

  return {
    rules: [
      { userAgent: "*", ...allowAll },
      ...SEARCH_CRAWLERS.map((userAgent) => ({ userAgent, ...allowAll })),
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...allowAll })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
