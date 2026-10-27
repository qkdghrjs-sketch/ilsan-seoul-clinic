"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "./header.css";
import { NAV } from "@/lib/nav";
import { CLINIC } from "@/lib/site";

const PC_QUERY = "(min-width: 1280px)";

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

/** 지금 보고 있는 페이지가 속한 메뉴 묶음 */
function findActiveGroup(pathname: string) {
  return (
    NAV.find(
      (group) =>
        pathname === group.href ||
        pathname.startsWith(`${group.href}/`) ||
        group.children.some((child) => child.href === pathname),
    )?.label ?? null
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isPc, setIsPc] = useState(false);
  const previousOverflow = useRef("");

  const activeGroup = findActiveGroup(pathname);

  /* 스크롤 시 그림자 (휴대폰 위쪽 띠) */
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 10);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  /* PC 화면인지 (PC는 왼쪽 세로 메뉴, 휴대폰은 전체 화면 메뉴) */
  useEffect(() => {
    const media = window.matchMedia(PC_QUERY);
    const sync = () => {
      setIsPc(media.matches);
      if (media.matches) setMenuOpen(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  /*
    페이지가 바뀌면 휴대폰 메뉴를 닫습니다.
    (effect 대신 렌더 중에 이전 경로와 비교하는 방식 — React 권장 패턴)
  */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setOpenGroup(null);
  }

  /* 휴대폰 메뉴가 열려 있는 동안 배경 스크롤 잠금 */
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

  /* ESC 로 닫기 */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      id="eum_header_wrap"
      className={`eum_header_wrap${scrolled ? " eum_scrolled" : ""}`}
    >
      {/* 휴대폰 위쪽 띠 (PC에서는 숨김) */}
      <header className="eum_header_inner">
        <h1 className="eum_logo">
          <Link href="/" title={`${CLINIC.name} 메인으로 이동`}>
            <LogoText />
          </Link>
        </h1>

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

      {/* 휴대폰 어두운 배경 */}
      <div
        className={`eum_mobile_overlay${menuOpen ? " eum_active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* 메뉴: 휴대폰은 전체 화면, PC는 왼쪽 세로 메뉴 */}
      <nav
        id="eum_mobile_nav"
        className={`eum_mobile_nav${menuOpen ? " eum_active" : ""}`}
        aria-label={`${CLINIC.shortName} 주요 메뉴`}
        aria-hidden={isPc ? undefined : !menuOpen}
      >
        <div className="eum_m_header">
          <Link
            href="/"
            className="eum_m_logo"
            title={`${CLINIC.name} 메인으로 이동`}
          >
            <strong className="eum_logo_mark">
              일산<em>서울</em>내과의원
            </strong>
            <span className="eum_logo_en">ILSAN SEOUL INTERNAL MEDICINE</span>
          </Link>
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
              const isOpen =
                activeGroup === group.label || openGroup === group.label;
              return (
                <li
                  key={group.label}
                  className={`eum_m_has_sub${isOpen ? " eum_open" : ""}`}
                >
                  <a
                    href={group.href}
                    onClick={(event) => {
                      /*
                        휴대폰: 처음 누르면 하위 메뉴를 펼치고, 펼쳐진 상태에서
                        다시 누르면 이동합니다.
                        PC: 바로 이동하고, 이동한 페이지의 하위 메뉴가 펼쳐집니다.
                      */
                      if (!isPc && !isOpen) {
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
                        <Link
                          key={child.href}
                          href={child.href}
                          className={pathname === child.href ? "eum_cur" : ""}
                          aria-current={
                            pathname === child.href ? "page" : undefined
                          }
                        >
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

        {/* 메뉴 바로 밑: 찾아오시는 길 (원장님 요청 2026-10-27 — 옛 홈피처럼 메뉴 아래) */}
        <Link href="/location" className="eum_side_loc">
          <h2>찾아오시는 길</h2>
          <p>{CLINIC.address.full}</p>
          <strong>
            <PhoneIcon size={13} />
            {CLINIC.telephoneDisplay}
          </strong>
        </Link>

        {/* PC 세로 메뉴 아래쪽: 진료시간 */}
        <div className="eum_side_foot">
          <h2>진료시간</h2>
          <dl>
            {CLINIC.outpatientRows.map((row) => (
              <div key={row.label} style={{ display: "contents" }}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </nav>
    </div>
  );
}
