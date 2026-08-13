"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import "./sub-header.css";
import { NAV, type NavGroup, type NavChild } from "@/lib/nav";

/**
 * 세부페이지 상단 브레드크럼.
 * 현재 경로를 넘기면 상위 카테고리와 현재 메뉴 드롭다운이 자동으로 구성됩니다.
 */
export default function SubPageHeader({
  currentPath,
  title,
}: {
  currentPath: string;
  /** 비워두면 메뉴 이름을 그대로 제목으로 씁니다. */
  title?: string;
}) {
  const [openDepth, setOpenDepth] = useState<1 | 2 | null>(null);

  useEffect(() => {
    const close = () => setOpenDepth(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  let group: NavGroup | undefined;
  let child: NavChild | undefined;

  for (const candidate of NAV) {
    const found = candidate.children.find((item) => item.href === currentPath);
    if (found) {
      group = candidate;
      child = found;
      break;
    }
  }

  if (!group || !child) {
    group = NAV[0];
    child = NAV[0].children[0];
  }

  const heading = title ?? child.label;

  const toggle = (depth: 1 | 2) => (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDepth((current) => (current === depth ? null : depth));
  };

  return (
    <div id="eum_sub_header_root">
      <div className="eum_sub_inner">
        <nav className="eum_breadcrumb" aria-label="현재 위치">
          <Link href="/" className="eum_bc_home" aria-label="홈으로">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </Link>
          <span className="eum_bc_divider" aria-hidden="true">
            ㆍ
          </span>

          {/* Depth 1 — 대분류 */}
          <div
            className={`eum_bc_dropdown${openDepth === 1 ? " active" : ""}`}
          >
            <button
              type="button"
              className="eum_bc_btn"
              onClick={toggle(1)}
              aria-expanded={openDepth === 1}
            >
              {group.label} <span className="arrow">▼</span>
            </button>
            <div
              className="eum_drop_box"
              onClick={(event) => event.stopPropagation()}
            >
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={item.label === group.label ? "active_menu" : ""}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <span className="eum_bc_divider" aria-hidden="true">
            ㆍ
          </span>

          {/* Depth 2 — 현재 메뉴 */}
          <div
            className={`eum_bc_dropdown${openDepth === 2 ? " active" : ""}`}
          >
            <button
              type="button"
              className="eum_bc_btn"
              onClick={toggle(2)}
              aria-expanded={openDepth === 2}
            >
              {child.label} <span className="arrow">▼</span>
            </button>
            <div
              className="eum_drop_box"
              onClick={(event) => event.stopPropagation()}
            >
              {group.children.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={item.href === currentPath ? "active_menu" : ""}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="eum_title_area">
          <h1>{heading}</h1>
        </div>
      </div>
    </div>
  );
}
