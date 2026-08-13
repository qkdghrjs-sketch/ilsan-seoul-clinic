"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "./header.css";
import { NAV } from "@/lib/nav";
import { CLINIC } from "@/lib/site";

const PhoneIcon = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9C1.6 3.92 2.33 3.1 3.3 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.36a16 16 0 0 0 6 6l.74-.74a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.28 18z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

/** 글자 로고 (이미지 대신 사용) */
function LogoText() {
  return (
    <span className="eum_logo_text">
      <strong className="eum_logo_mark">
        일산<em>서울</em>내과의원
      </strong>
      <span className="eum_logo_en">ILSAN SEOUL INTERNAL MEDICINE</span>
    </span>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const previousOverflow = useRef("");

  /* 스크롤 시 그림자 */
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 10);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  /*
    페이지가 바뀌면 모바일 메뉴를 닫습니다.
    (effect 대신 렌더 중에 이전 경로와 비교하는 방식 — React 권장 패턴)
  */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setOpenGroup(null);
  }

  /* 메뉴가 열려 있는 동안 배경 스크롤 잠금 */
  useEffect(() => {
    if (menuOpen) {
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow.current;
    }
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, [menuOpen]);

  /* ESC 로 닫기 · 데스크톱 폭으로 넓어지면 자동으로 닫기 */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 1200) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      id="eum_header_wrap"
      className={`eum_header_wrap${scrolled ? " eum_scrolled" : ""}`}
    >
      <header className="eum_header_inner">
        <h1 className="eum_logo">
          <Link href="/" title={`${CLINIC.name} 메인으로 이동`}>
            <LogoText />
          </Link>
        </h1>

        {/* PC 네비게이션 */}
        <nav className="eum_pc_nav" aria-label={`${CLINIC.shortName} 주요 메뉴`}>
          <ul className="eum_gnb">
            {NAV.map((group) => (
              <li key={group.label}>
                <Link href={group.href}>{group.label}</Link>
                <ul className="eum_lnb">
                  {group.children.map((child) => (
                    <li key={child.href + child.label}>
                      <Link
                        href={child.href}
                        {...(child.labelPc
                          ? {
                              dangerouslySetInnerHTML: {
                                __html: child.labelPc,
                              },
                            }
                          : { children: child.label })}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* PC CTA */}
        <div className="eum_header_btns">
          <Link href="/location" className="eum_header_hours">
            <ClockIcon />
            진료시간 · 오시는 길
          </Link>
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="eum_header_cta">
            <PhoneIcon />
            {CLINIC.telephoneDisplay}
          </a>
        </div>

        <button
          type="button"
          className="eum_hamburger"
          aria-label="메뉴 열기"
          aria-controls="eum_mobile_nav"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className="eum_header_bg" />

      {/* 모바일 오버레이 */}
      <div
        className={`eum_mobile_overlay${menuOpen ? " eum_active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* 모바일 네비게이션 */}
      <nav
        id="eum_mobile_nav"
        className={`eum_mobile_nav${menuOpen ? " eum_active" : ""}`}
        aria-label={`${CLINIC.shortName} 모바일 메뉴`}
        aria-hidden={!menuOpen}
      >
        <div className="eum_m_header">
          <span className="eum_m_logo">
            <strong className="eum_logo_mark">
              일산<em>서울</em>내과의원
            </strong>
            <span className="eum_logo_en">ILSAN SEOUL INTERNAL MEDICINE</span>
          </span>
          <button
            type="button"
            className="eum_m_close"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="eum_m_tel_banner">
          <a href={`tel:${CLINIC.telephoneDisplay}`}>
            <PhoneIcon size={14} />
            상담·예약 {CLINIC.telephoneDisplay}
          </a>
        </div>

        <div className="eum_m_reserve_btns">
          <Link href="/location" className="eum_m_btn_hours">
            <ClockIcon />
            진료시간 · 오시는 길
          </Link>
        </div>

        <div className="eum_m_body">
          <ul className="eum_m_gnb">
            {NAV.map((group) => {
              const isOpen = openGroup === group.label;
              return (
                <li
                  key={group.label}
                  className={`eum_m_has_sub${isOpen ? " eum_open" : ""}`}
                >
                  <a
                    href={group.href}
                    onClick={(event) => {
                      // 처음 누르면 하위 메뉴를 펼치고, 펼쳐진 상태에서 다시 누르면 이동합니다.
                      if (!isOpen) {
                        event.preventDefault();
                        setOpenGroup(group.label);
                      }
                    }}
                  >
                    {group.label}
                  </a>
                  <div
                    className="eum_m_lnb"
                    style={{ maxHeight: isOpen ? "600px" : 0 }}
                  >
                    <div className="eum_m_lnb_inner">
                      {group.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
