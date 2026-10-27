import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import LocationSection from "@/components/layout/LocationSection";

import JsonLd from "@/components/JsonLd";
import { pageSchemas } from "@/lib/page-schema";

const PATH = "/location";
const TITLE = "찾아오시는 길";
const DESCRIPTION =
  "일산서울내과의원 진료시간과 찾아오시는 길 안내. 경기도 고양시 일산서구 주엽2동 17 동부썬프라자C동 2층 206호, 지하철 3호선 주엽역 인근 롯데마트 근처. 월·화·수·금 09:00~18:00, 목·토 09:00~13:00.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

export default function LocationPage() {
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

      {/* 원장님 요청(2026-10-27): 첫 문구·전화 상자 없이 바로 진료시간과 약도 */}
      <LocationSection
        title="일산서울내과의원 오시는 길"
        eyebrow="진료시간 안내"
      />
    </>
  );
}
