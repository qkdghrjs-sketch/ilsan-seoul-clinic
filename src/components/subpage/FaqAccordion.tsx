"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FaqItem = {
  q: string;
  /** 문자열은 그대로, ReactNode는 그대로 렌더링됩니다. */
  a: React.ReactNode;
};

export type FaqCategory = {
  label?: string;
  items: FaqItem[];
};

/**
 * FAQ 아코디언.
 *
 * 접혀 있어도 답변 텍스트는 HTML에 그대로 존재합니다.
 * (max-height로만 숨기므로 검색엔진과 AI가 전부 읽을 수 있습니다.)
 */
export default function FaqAccordion({
  categories,
}: {
  categories: FaqCategory[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const panelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /**
   * 열려 있는 패널의 높이를 실제 내용 높이에 맞춥니다.
   * 렌더링 중에 ref 값을 읽으면 React 규칙에 어긋나므로,
   * 화면에 그려진 뒤(useEffect)에 높이를 지정합니다.
   */
  const syncHeights = useCallback(() => {
    panelRefs.current.forEach((panel, key) => {
      panel.style.maxHeight = key === openKey ? `${panel.scrollHeight}px` : "0px";
    });
  }, [openKey]);

  useEffect(() => {
    syncHeights();
  }, [syncHeights]);

  /* 창 크기가 바뀌면 높이를 다시 계산합니다. */
  useEffect(() => {
    window.addEventListener("resize", syncHeights);
    return () => window.removeEventListener("resize", syncHeights);
  }, [syncHeights]);

  return (
    <div className="eum_rv d2 sp_faq">
      {categories.map((category, categoryIndex) => (
        <div key={category.label ?? `cat-${categoryIndex}`}>
          {category.label && (
            <div className="sp_faq_cat">
              <span className="sp_faq_cat_line" />
              <span className="sp_faq_cat_label">{category.label}</span>
            </div>
          )}

          {category.items.map((item, itemIndex) => {
            const key = `${categoryIndex}-${itemIndex}`;
            const isOpen = openKey === key;

            return (
              <div className={`sp_faq_item${isOpen ? " open" : ""}`} key={key}>
                <button
                  type="button"
                  className="sp_faq_q"
                  aria-expanded={isOpen}
                  onClick={() => setOpenKey(isOpen ? null : key)}
                >
                  <span className="sp_q_icon">Q</span>
                  <span className="sp_q_text">{item.q}</span>
                  <span className="sp_faq_arrow" />
                </button>

                <div
                  className="sp_faq_a"
                  ref={(node) => {
                    if (node) panelRefs.current.set(key, node);
                    else panelRefs.current.delete(key);
                  }}
                  /* 첫 렌더에서는 접힌 상태로 두고, 열림 여부는 위 useEffect가 맞춥니다. */
                  style={{ maxHeight: 0 }}
                >
                  <div className="sp_faq_a_inner">
                    <span className="sp_a_icon">A</span>
                    <div className="sp_a_text">{item.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
