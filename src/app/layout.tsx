import type { Metadata } from "next";
import "./globals.css";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { clinicSchema } from "@/lib/schema";
import { CLINIC, SITE_URL } from "@/lib/site";

const DEFAULT_TITLE = `${CLINIC.name} | 일산 주엽동 내과`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${CLINIC.name}`,
  },
  description: CLINIC.description,
  applicationName: CLINIC.name,
  authors: [{ name: `${CLINIC.founder} 원장` }],
  creator: CLINIC.name,
  publisher: CLINIC.name,
  keywords: [
    "일산서울내과",
    "일산서울내과의원",
    "일산 내과",
    "주엽동 내과",
    "일산서구 내과",
    "주엽역 내과",
    "일산 수면내시경",
    "수면 위내시경",
    "국민건강보험공단 검진",
    "고혈압",
    "당뇨병",
    "B형간염",
  ],
  formatDetection: { telephone: true, address: true, email: false },
  openGraph: {
    type: "website",
    siteName: CLINIC.name,
    locale: "ko_KR",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: CLINIC.description,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: CLINIC.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  verification: {
    // 서치콘솔·네이버 웹마스터 인증 코드를 받으면 환경변수에 넣어 주세요.
    other: {
      ...(process.env.NAVER_SITE_VERIFICATION
        ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
        : {}),
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/*
          AI 모델용 요약 문서의 위치를 알려 줍니다.
          병원 정보·진료시간·자주 묻는 질문이 평문으로 정리돼 있어,
          AI가 화면을 해석하지 않고도 정확한 내용을 그대로 읽어 갑니다.
        */}
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title={`${CLINIC.shortName} 요약 정보 (AI용)`}
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms-full.txt"
          title={`${CLINIC.shortName} 전체 문서 (AI용)`}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white antialiased">
        <JsonLd data={clinicSchema()} />
        <SiteHeader />
        {/* 고정 헤더가 본문을 가리지 않도록 하는 여백 */}
        <div className="eum_header_spacer" />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
