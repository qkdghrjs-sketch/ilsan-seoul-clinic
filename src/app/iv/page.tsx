import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import {
  SubPage,
  SubHero,
  HeroInfoCard,
  Section,
  SectionHeader,
  Note,
} from "@/components/subpage/parts";
import Icon from "@/components/subpage/icons";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { IV_ITEMS } from "@/lib/iv";

const PATH = "/iv";
const TITLE = "수액 치료센터 안내";
const DESCRIPTION =
  "일산서울내과의원 수액 치료센터 안내. 감기수액, 어르신 수액, 수험생 수액, 간보충 수액, 신경통 만성질환 수액, 프리미엄 집중 수액, 어르신 집중 수액을 운영합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

/** 카드별 강조색 — 파랑·청록 계열 안에서만 변주합니다 */
const ACCENTS = ["#1a3a6c", "#2b5ba8", "#2f9fc4", "#2e9580", "#4bb89c", "#3f6fb5"];

export default function IvPage() {
  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [{ name: "수액 치료센터", url: PATH }],
          medical: true,
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="IV THERAPY CENTER · 수액 치료센터"
          title={
            <>
              지금 몸 상태에 맞는
              <br />
              <em>수액을 안내</em>해 드립니다
            </>
          }
          sub="진찰 후 현재 상태에 맞는 수액을 권해 드립니다."
          cards={
            <>
              <HeroInfoCard icon="drop" label="수액 종류" delay="d2">
                {IV_ITEMS.length}가지
              </HeroInfoCard>
              <HeroInfoCard icon="user" label="진찰" teal delay="d3">
                원장 진찰 후 안내
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="문의" delay="d4">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />


        <Section tightTop>
          <SectionHeader
            eyebrow="PROGRAMS"
            title="수액 종류"
            desc="수액별로 들어가는 성분을 안내해 드립니다."
          />

          <div className="sp_trt_grid">
            {IV_ITEMS.map((item, index) => (
              <div
                id={item.id}
                key={item.id}
                className={`eum_rv d${Math.min(index + 2, 5)} sp_trt_card`}
                data-accent=""
                style={
                  {
                    "--accent": ACCENTS[index % ACCENTS.length],
                  } as React.CSSProperties
                }
              >
                <div className="sp_deco" />
                <div className="sp_trt_icon">
                  <Icon name={item.icon} />
                </div>
                <h3 className="sp_trt_title">{item.title}</h3>
                <div className="sp_trt_list">
                  {item.purpose && (
                    <div className="sp_trt_item">
                      <span className="sp_dot" />
                      <span className="sp_trt_text">{item.purpose}</span>
                    </div>
                  )}
                  {item.contents.length > 0 && (
                    <div className="sp_trt_item">
                      <span className="sp_dot" />
                      <span className="sp_trt_text">
                        <strong>구성</strong> · {item.contents.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section narrow tightTop>
          <Note title="맞기 전에 알려 주세요" navy>
            수액은 개인의 건강 상태, 복용 중인 약, 알레르기 여부에 따라 맞지
            않을 수 있습니다. 먼저 진찰을 받고 원장과 상의한 뒤 결정해 주세요.
            수액의 종류와 비용은 전화로 문의하실 수 있습니다.
          </Note>
          <p className="eum_rv d2 sp_disclaimer">
            수액의 효과는 개인에 따라 다를 수 있으며, 질병의 치료를 보장하지
            않습니다.
          </p>
        </Section>

      </SubPage>
    </>
  );
}
