"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * 사진을 누르면 화면 가득 크게 보는 갤러리 (원장님 요청 2026-11-02, 본원 둘러보기).
 * - 크게 보기: 사진 전체가 잘리지 않게 원본 비율 그대로
 * - 옆 사진: 좌우 화살표 버튼 · 키보드 ←/→ · 휴대폰은 옆으로 밀기
 * - 닫기: ✕ 버튼 · 어두운 바깥 누르기 · Esc
 */

type Item = { src: string; alt: string; caption?: string };

export default function ZoomGallery({ items, wide }: { items: Item[]; wide?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (step: number) =>
      setOpen((cur) => (cur === null ? cur : (cur + step + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  const current = open === null ? null : items[open];

  return (
    <>
      <div className={`sp_gallery${wide ? " wide" : ""}`}>
        {items.map((item, index) => (
          <figure
            className={`eum_rv d${Math.min(index + 2, 5)} sp_gallery_item zoomable`}
            key={item.src}
          >
            <button
              type="button"
              className="zg_btn"
              onClick={() => setOpen(index)}
              aria-label={`${item.caption ?? item.alt} 사진 크게 보기`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} loading="lazy" />
              <span className="zg_hint" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4.5 4.5M11 8v6M8 11h6" />
                </svg>
                크게 보기
              </span>
            </button>
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {current && open !== null && createPortal(
        <div
          className="zg_overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.caption ?? current.alt} 크게 보기`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <button ref={closeRef} type="button" className="zg_close" onClick={() => setOpen(null)} aria-label="닫기">
            ✕
          </button>
          <figure className="zg_figure" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt} />
            <figcaption>
              {current.caption ?? current.alt}
              <span className="zg_count">
                {open + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
          {items.length > 1 && (
            <>
              <button type="button" className="zg_nav prev" onClick={() => go(-1)} aria-label="이전 사진">
                ‹
              </button>
              <button type="button" className="zg_nav next" onClick={() => go(1)} aria-label="다음 사진">
                ›
              </button>
            </>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
