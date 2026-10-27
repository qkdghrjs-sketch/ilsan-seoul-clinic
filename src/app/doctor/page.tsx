import type { Metadata } from "next";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import { SubPage } from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { doctorSchema } from "@/lib/schema";
import { CLINIC } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";

const PATH = "/doctor";
const TITLE = "원장님 소개";
const DESCRIPTION =
  "일산서울내과의원 김금미 원장 소개. 1989년 이화여자대학교 의과대학 졸업, 1994년 이화여자대학교 부속병원 내과전문의 수료, 1996년 의학박사 학위 수료. 소화기내시경 세부전문의·심장초음파 세부인증의, 현재 이화여자대학교 의과대학 외래교수.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

/*
  원장님 요청(2026-10-22·10-27): 파란 바탕 안에 약력만 흰색 큰 글씨로.
  그 아래 설명·진료 분야·문의 상자는 모두 뺐습니다.
  사진은 원본 비율 그대로(머리 잘림 없이) 보여 줍니다.
*/
export default function DoctorPage() {
  return (
    <>
      <JsonLd
        data={[
          doctorSchema(),
          ...pageSchemas({
            path: PATH,
            name: `${DOCTOR.name} 소개`,
            description: DESCRIPTION,
            breadcrumb: [
              { name: "본원소개", url: PATH },
              { name: TITLE, url: PATH },
            ],
          }),
        ]}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <div className="sp_hero dr_hero">
          <div className="sp_hero_glow" />
          <div className="dr_inner">
            <div className="dr_career">
              <h2 className="eum_rv d1 dr_name">{DOCTOR.name}</h2>

              <div className="eum_rv d2 dr_group">
                <h3 className="dr_label">현재</h3>
                <ul>
                  {DOCTOR.current.map((item) => (
                    <li key={item}>현) {item}</li>
                  ))}
                </ul>
              </div>

              <div className="eum_rv d3 dr_group">
                <h3 className="dr_label">학력 · 수련</h3>
                <ul>
                  {DOCTOR.career.map((item) => (
                    <li key={item.year + item.text}>
                      <b>{item.year}.</b> {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="eum_rv d4 dr_group">
                <h3 className="dr_label">수상</h3>
                <ul>
                  {DOCTOR.awards.map((item) => (
                    <li key={item.year + item.text}>
                      <b>{item.year}.</b> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="eum_rv d2 dr_photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DOCTOR.photo}
                alt={`${CLINIC.name} ${DOCTOR.name}`}
                width={354}
                height={472}
              />
            </div>
          </div>
        </div>
      </SubPage>
    </>
  );
}
