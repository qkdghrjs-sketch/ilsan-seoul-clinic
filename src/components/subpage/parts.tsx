import "./subpage.css";

import Reveal from "@/components/Reveal";
import Icon, { type IconName } from "./icons";

/* ══════════════════════════════════════════════
   페이지 래퍼
══════════════════════════════════════════════ */
export function SubPage({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="sp" selector=".eum_rv">
      {children}
    </Reveal>
  );
}

/* ══════════════════════════════════════════════
   히어로
══════════════════════════════════════════════ */
export function SubHero({
  eyebrow,
  title,
  sub,
  badges,
  image,
  imageAlt,
  imageFit = "cover",
  cards,
  blue,
  subLong,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  badges?: string[];
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  cards?: React.ReactNode;
  /** 파란 바탕 (원장님 요청 2026-10-27) */
  blue?: boolean;
  /** 여러 문단 설명을 흰 큰 글씨로 (sub 에 <p> 여러 개를 넘깁니다) */
  subLong?: boolean;
}) {
  return (
    <div className={`sp_hero${blue ? " blue" : ""}`}>
      <div className="sp_hero_glow" />
      <div className={`sp_hero_inner${cards ? " center" : ""}`}>
        <div className="sp_hero_text">
          <div className="eum_rv d1 sp_eyebrow">
            <span className="sp_eyebrow_line" />
            {eyebrow}
          </div>
          <h1 className="eum_rv d2 sp_hero_title">{title}</h1>
          {sub &&
            (subLong ? (
              <div className="eum_rv d3 sp_hero_sub long">{sub}</div>
            ) : (
              <p className="eum_rv d3 sp_hero_sub">{sub}</p>
            ))}
          {badges && badges.length > 0 && (
            <div className="eum_rv d4 sp_badges">
              {badges.map((badge) => (
                <span className="sp_badge" key={badge}>
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div className="eum_rv d3 sp_hero_img_col">
            <div
              className={`sp_hero_img_box${imageFit === "contain" ? " contain" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={imageAlt ?? ""} />
            </div>
          </div>
        )}

        {cards && <div className="sp_hero_cards">{cards}</div>}
      </div>
    </div>
  );
}

export function HeroInfoCard({
  icon,
  label,
  children,
  teal,
  delay = "d2",
}: {
  icon: IconName;
  label: string;
  children: React.ReactNode;
  teal?: boolean;
  delay?: string;
}) {
  return (
    <div className={`eum_rv ${delay} sp_info_card`}>
      <div className={`sp_info_icon${teal ? " teal" : ""}`}>
        <Icon name={icon} />
      </div>
      <div>
        <span className="sp_info_label">{label}</span>
        <span className="sp_info_val">{children}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   섹션 · 헤더
══════════════════════════════════════════════ */
export function Section({
  alt,
  tightTop,
  narrow,
  children,
}: {
  alt?: boolean;
  tightTop?: boolean;
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`sp_sec${alt ? " alt" : ""}${tightTop ? " tight_top" : ""}`}
    >
      <div className={`sp_inner${narrow ? " narrow" : ""}`}>{children}</div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  left,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  left?: boolean;
}) {
  return (
    <div className={`eum_rv d1 sp_hd${left ? " left" : ""}`}>
      <span className="sp_hd_eyebrow">{eyebrow}</span>
      <h2 className="sp_hd_title">{title}</h2>
      {desc && <p className="sp_hd_desc">{desc}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   인트로 박스
══════════════════════════════════════════════ */
export function IntroBox({
  title,
  en,
  image,
  imageAlt,
  paragraphs,
}: {
  title: string;
  en?: string;
  image?: string;
  imageAlt?: string;
  paragraphs: React.ReactNode[];
}) {
  return (
    <div className="eum_rv d1 sp_intro_box">
      {image && (
        <div className="sp_intro_img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt ?? title} />
        </div>
      )}
      <div className="sp_intro_text">
        <h2 className="sp_intro_title">{title}</h2>
        {en && <span className="sp_intro_en">{en}</span>}
        {paragraphs.map((paragraph, index) => (
          <span className="sp_intro_p" key={index}>
            {paragraph}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   증상 카드 그룹
══════════════════════════════════════════════ */
export type SymptomItem = {
  icon: IconName;
  name: string;
  sub: string;
};

export function SymptomGroup({
  label,
  color,
  items,
}: {
  label: string;
  color?: string;
  items: SymptomItem[];
}) {
  return (
    <div className="sp_group">
      <div className="eum_rv d1 sp_cat">
        <span
          className="sp_cat_line"
          style={color ? { background: color } : undefined}
        />
        <span className="sp_cat_label" style={color ? { color } : undefined}>
          {label}
        </span>
      </div>
      <div className="sp_symp_grid">
        {items.map((item, index) => (
          <div
            className={`eum_rv d${Math.min(index + 2, 5)} sp_symp_card`}
            key={item.name}
          >
            <div className="sp_symp_icon">
              <Icon name={item.icon} />
            </div>
            <span className="sp_symp_name">{item.name}</span>
            <span className="sp_symp_sub">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   치료 카드
══════════════════════════════════════════════ */
export type TreatmentCard = {
  icon: IconName;
  title: string;
  items: React.ReactNode[];
};

export function TreatmentGrid({ cards }: { cards: TreatmentCard[] }) {
  return (
    <div className="sp_trt_grid">
      {cards.map((card, index) => (
        <div
          className={`eum_rv d${Math.min(index + 2, 5)} sp_trt_card`}
          key={card.title}
        >
          <div className="sp_deco" />
          <div className="sp_trt_icon">
            <Icon name={card.icon} />
          </div>
          <h3 className="sp_trt_title">{card.title}</h3>
          <div className="sp_trt_list">
            {card.items.map((item, itemIndex) => (
              <div className="sp_trt_item" key={itemIndex}>
                <span className="sp_dot" />
                <span className="sp_trt_text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   요약 박스
══════════════════════════════════════════════ */
export function SummaryBox({
  title,
  items,
}: {
  title: string;
  items: React.ReactNode[];
}) {
  return (
    <div className="eum_rv d2 sp_sum_box">
      <div className="sp_sum_title_wrap">
        <Icon name="checkCircle" />
        <span className="sp_sum_title">{title}</span>
      </div>
      <div className="sp_sum_list">
        {items.map((item, index) => (
          <div className="sp_sum_item" key={index}>
            <Icon name="checkCircle" />
            <span className="sp_sum_text">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   체크리스트 박스
══════════════════════════════════════════════ */
export function CheckBox({
  lead,
  items,
}: {
  lead?: string;
  items: React.ReactNode[];
}) {
  return (
    <div className="eum_rv d2 sp_check_box">
      {lead && <p className="sp_check_lead">{lead}</p>}
      <ul className="sp_check_list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/* ══════════════════════════════════════════════
   인포 노트
══════════════════════════════════════════════ */
export function Note({
  title,
  navy,
  children,
}: {
  title?: string;
  navy?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`eum_rv d1 sp_note${navy ? " navy" : ""}`}>
      {title && (
        <>
          <strong>{title}</strong>
          <br />
        </>
      )}
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
   사진 모음 (검사 화면 예시 · 본원 둘러보기)
══════════════════════════════════════════════ */
export function Gallery({
  items,
  wide,
}: {
  items: Array<{ src: string; alt: string; caption?: string }>;
  /** 가로로 긴 사진(병원 내부)일 때 */
  wide?: boolean;
}) {
  return (
    <div className={`sp_gallery${wide ? " wide" : ""}`}>
      {items.map((item, index) => (
        <figure
          className={`eum_rv d${Math.min(index + 2, 5)} sp_gallery_item`}
          key={item.src}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt={item.alt} loading="lazy" />
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
