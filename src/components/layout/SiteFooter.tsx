"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import "./footer.css";
import { CLINIC } from "@/lib/site";
import { EXTERNAL } from "@/lib/nav";
import { POLICIES, type PolicyKey } from "@/lib/policies";

/** 푸터에서 바로 갈 수 있는 주요 안내 */
const QUICK_LINKS = [
  {
    href: "/endoscopy",
    title: "수면 위 내시경 안내",
    sub: "검사 과정과 준비사항을 확인해 보세요.",
  },
  {
    href: "/checkup",
    title: "검사안내 전체보기",
    sub: "정기검사 · 공단검진 · 정밀종합검사",
  },
];

export default function SiteFooter() {
  const [openPolicy, setOpenPolicy] = useState<PolicyKey | null>(null);

  useEffect(() => {
    if (openPolicy) {
      document.body.classList.add("eum_modal_body_locked");
    } else {
      document.body.classList.remove("eum_modal_body_locked");
    }
    return () => document.body.classList.remove("eum_modal_body_locked");
  }, [openPolicy]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPolicy(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const policy = openPolicy ? POLICIES[openPolicy] : null;

  return (
    <>
      <footer className="eum_footer_wrap">
        <div className="eum_footer_inner">
          <div className="eum_footer_top">
            {/* 주요 안내 바로가기 */}
            <div className="eum_footer_notice">
              <div className="eum_top_header">
                <div className="eum_top_titles">
                  <h3>진료 안내</h3>
                  <p>궁금하신 내용을 바로 확인하실 수 있습니다.</p>
                </div>
              </div>
              <div className="eum_notice_cta_list">
                {QUICK_LINKS.map((item) => (
                  <Link key={item.href} href={item.href} className="eum_notice_cta">
                    <span className="eum_notice_cta_text">
                      <span className="eum_notice_cta_title">{item.title}</span>
                      <span className="eum_notice_cta_sub">{item.sub}</span>
                    </span>
                    <span className="eum_notice_cta_arrow">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 대표전화 */}
            <div className="eum_footer_contact">
              <div className="eum_top_header">
                <div className="eum_top_titles">
                  <h3>상담 · 예약</h3>
                  <p>전화번호를 누르면 바로 연결됩니다.</p>
                </div>
              </div>
              <div className="eum_contact_content">
                <a
                  href={`tel:${CLINIC.telephoneDisplay}`}
                  className="eum_tel_number"
                  aria-label={`${CLINIC.name} 상담·예약 전화 ${CLINIC.telephoneDisplay}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  031.918.2322
                </a>
                <div className="eum_contact_btns">
                  <Link href="/location" className="eum_action_btn eum_btn_hours">
                    <span className="eum_action_icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3.5 2" />
                      </svg>
                    </span>
                    <span className="eum_action_text">
                      <strong>진료시간 안내</strong>
                      <em>평일 09:00 ~ 18:00 · 목·토 13:00까지</em>
                    </span>
                    <span className="eum_action_arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                  <a
                    href={EXTERNAL.naverMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eum_action_btn eum_btn_map"
                  >
                    <span className="eum_action_icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <span className="eum_action_text">
                      <strong>지도에서 찾기</strong>
                      <em>주엽역 인근 · 롯데마트 근처</em>
                    </span>
                    <span className="eum_action_arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 병원 정보 */}
          <div className="eum_footer_bottom">
            <div className="eum_fb_top">
              <span className="eum_footer_logo">
                <strong className="eum_logo_mark">일산서울내과의원</strong>
                <span className="eum_logo_en">
                  ILSAN SEOUL INTERNAL MEDICINE
                </span>
              </span>
            </div>
            <div className="eum_fb_info_row">
              <div className="eum_company_info">
                <span className="eum_addr">
                  {CLINIC.address.full} {CLINIC.name}
                </span>
                <div className="eum_info_wrapper">
                  <div className="eum_info_black_group">
                    <span className="eum_info_item">
                      <span className="eum_label">대표자명:</span>{" "}
                      <span className="eum_val">{CLINIC.founder}</span>
                    </span>
                    <span className="eum_divider eum_pc_only">|</span>
                    <span className="eum_info_item">
                      <span className="eum_label">상담·예약:</span>{" "}
                      <span className="eum_val">{CLINIC.telephoneDisplay}</span>
                    </span>
                  </div>
                  <span className="eum_divider eum_pc_only">|</span>
                  <span className="eum_info_item eum_copyright">
                    ⓒ 2026 {CLINIC.name} All Rights Reserved.
                  </span>
                </div>
              </div>

              <div className="eum_policy_links">
                <button
                  type="button"
                  className="eum_privacy"
                  onClick={() => setOpenPolicy("privacy")}
                >
                  개인정보처리방침
                </button>
                <button type="button" onClick={() => setOpenPolicy("terms")}>
                  이용약관
                </button>
                <button type="button" onClick={() => setOpenPolicy("rights")}>
                  환자의 권리와 의무
                </button>
                <Link href="/doctor">원장님 소개</Link>
                <Link href="/location">오시는 길</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 정책 모달 */}
      <div
        className={`eum_modal_overlay${policy ? " eum_modal_active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!policy}
        aria-label={policy?.title ?? "안내"}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpenPolicy(null);
        }}
      >
        <div className="eum_modal_box">
          <div className="eum_modal_header">
            <h4 className="eum_modal_title">{policy?.title ?? "안내"}</h4>
            <button
              type="button"
              className="eum_modal_close"
              aria-label="팝업 닫기"
              onClick={() => setOpenPolicy(null)}
            >
              ✕
            </button>
          </div>
          <div
            className="eum_modal_body"
            dangerouslySetInnerHTML={{ __html: policy?.html ?? "" }}
          />
        </div>
      </div>
    </>
  );
}
