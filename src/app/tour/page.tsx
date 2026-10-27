import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import {
  SubPage,
  SubHero,
  HeroInfoCard,
  Section,
  SectionHeader,
  Gallery,
} from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";

const PATH = "/tour";
const TITLE = "본원 둘러보기";
const DESCRIPTION =
  "일산서울내과의원 본원 둘러보기. 입구, 접수·대기 공간, 검사실 사진으로 방문 전에 병원 모습을 미리 확인하세요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

const PHOTOS = [
  {
    src: "/images/tour/entrance.jpg",
    alt: "일산서울내과의원 입구 — 동부썬프라자 C동 2층 206호",
    caption: "입구 (동부썬프라자 C동 2층 206호)",
  },
  {
    src: "/images/tour/lobby.jpg",
    alt: "일산서울내과의원 접수 창구와 대기 공간",
    caption: "접수 · 대기 공간",
  },
  {
    src: "/images/tour/waiting.jpg",
    alt: "일산서울내과의원 대기 의자와 검사실 안내",
    caption: "대기 의자와 검사실 안내",
  },
  {
    src: "/images/tour/clinic-room.jpg",
    alt: "일산서울내과의원 원장 진료실",
    caption: "진료실",
  },
  {
    src: "/images/tour/exam-1.jpg",
    alt: "일산서울내과의원 초음파 장비와 내시경 장비가 있는 검사실",
    caption: "검사실 (초음파 · 내시경 장비)",
  },
];

export default function TourPage() {
  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [
            { name: "본원소개", url: "/doctor" },
            { name: TITLE, url: PATH },
          ],
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="HOSPITAL TOUR · 본원 둘러보기"
          title={
            <>
              방문하시기 전에,
              <br />
              <em>미리 둘러보세요</em>
            </>
          }
          sub="입구부터 대기 공간, 진료실, 검사실까지 본원의 모습을 사진으로 안내해 드립니다."
          cards={
            <>
              <HeroInfoCard icon="pin" label="위치" delay="d2">
                동부썬프라자 C동 2층 206호
              </HeroInfoCard>
              <HeroInfoCard icon="clock" label="점심시간" teal delay="d3">
                오후 1:00 ~ 2:00
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="상담·예약" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop>
          <SectionHeader
            eyebrow="PHOTO"
            title="본원 모습"
            desc="입구, 대기 공간, 진료실, 검사실 순서로 보여 드립니다."
          />
          <Gallery items={PHOTOS} wide />
        </Section>
      </SubPage>
    </>
  );
}
