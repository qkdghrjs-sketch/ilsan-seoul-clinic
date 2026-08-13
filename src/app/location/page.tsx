import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import LocationSection from "@/components/layout/LocationSection";
import {
  SubPage,
  SubHero,
  HeroInfoCard,
  SubCta,
} from "@/components/subpage/parts";
import JsonLd from "@/components/JsonLd";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { EXTERNAL } from "@/lib/nav";

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

      <SubPage>
        <SubHero
          eyebrow="LOCATION & HOURS · 오시는 길"
          title={
            <>
              주엽역 가까이,
              <br />
              <em>일산서울내과</em>로
              <br />
              편하게 오세요
            </>
          }
          sub={
            <>
              경기도 고양시 일산서구 주엽동 동부썬프라자 C동 2층에 있습니다.
              <br />
              롯데마트 근처, 지하철 3호선 주엽역에서 가까운 거리입니다.
            </>
          }
          cards={
            <>
              <HeroInfoCard icon="pin" label="주소" delay="d2">
                {CLINIC.address.full}
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="상담·예약" delay="d3">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
              <HeroInfoCard icon="clock" label="진료시간" teal delay="d4">
                평일 09:00 ~ 18:00
                <span className="sp_teal_badge">목·토 오후 1시까지</span>
              </HeroInfoCard>
            </>
          }
        />
      </SubPage>

      {/* 진료시간 + 지도 (지도는 페이지당 한 번만 렌더링) */}
      <LocationSection
        title="일산서울내과의원 오시는 길"
        eyebrow="진료시간 안내"
      />

      <SubPage>
        <SubCta
          title={
            <>
              찾아오시는 길이 헷갈리시면
              <br />
              전화 주세요
            </>
          }
          sub={
            <>
              지하철 3호선 주엽역 인근, 롯데마트 근처 동부썬프라자 C동 2층
              206호입니다.
              <br />
              수면 위내시경은 예약제로 운영되니 미리 전화해 주세요.
            </>
          }
          secondaryLabel="네이버 지도로 열기 →"
          secondaryHref={EXTERNAL.naverMap}
        />
      </SubPage>
    </>
  );
}
