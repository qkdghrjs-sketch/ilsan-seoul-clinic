import Link from "next/link";
import "./subpage.css";

import Reveal from "@/components/Reveal";
import Icon, { type IconName } from "./icons";
import { CLINIC } from "@/lib/site";

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
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  badges?: string[];
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  cards?: React.ReactNode;
}) {
  return (
    <div className="sp_hero">
      <div className="sp_hero_glow" />
      <div className={`sp_hero_inner${cards ? " center" : ""}`}>
        <div className="sp_hero_text">
          <div className="eum_rv d1 sp_eyebrow">
            <span className="sp_eyebrow_line" />
            {eyebrow}
          </div>
          <h1 className="eum_rv d2 sp_hero_title">{title}</h1>
          {sub && <p className="eum_rv d3 sp_hero_sub">{sub}</p>}
          {badges && badges.length > 0 && (
            <div className="eum_rv d4 sp_badges">
              {badges.map((badge) => (
                <span className="sp_badge" key={badge}>
                  <span className="sp_badge_dot" />
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
   핵심 답변 블록
   AI가 이 부분만 읽어도 답이 되도록, 주어(일산서울내과의원)와
   근거(수치·인증·위치)를 한 문단 안에 모두 담습니다.
══════════════════════════════════════════════ */
export function KeyAnswer({
  question,
  children,
  facts,
}: {
  question: string;
  children: React.ReactNode;
  facts?: string[];
}) {
  return (
    <div className="eum_rv d1 sp_answer">
      <span className="sp_answer_label">한 줄 답변</span>
      <p className="sp_answer_q">{question}</p>
      <div className="sp_answer_a">{children}</div>
      {facts && facts.length > 0 && (
        <div className="sp_answer_meta">
          {facts.map((fact) => (
            <span className="sp_answer_fact" key={fact}>
              {fact}
            </span>
          ))}
        </div>
      )}
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
   CTA
══════════════════════════════════════════════ */
export function SubCta({
  title,
  sub,
  note,
  secondaryLabel = "오시는 길 안내 →",
  secondaryHref = "/location",
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  note?: React.ReactNode;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  const isInternal = secondaryHref.startsWith("/");

  return (
    <div className="sp_cta">
      <div className="sp_cta_inner">
        <h2 className="eum_rv d1 sp_cta_title">{title}</h2>
        {sub && <p className="eum_rv d2 sp_cta_sub">{sub}</p>}
        {note && <span className="eum_rv d3 sp_cta_note">{note}</span>}
        <div className="eum_rv d3 sp_cta_btns">
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="sp_btn_w">
            <Icon name="phone" size={15} className="sp_btn_icon" />
            {CLINIC.telephoneDisplay} 전화 문의
          </a>
          {isInternal ? (
            <Link href={secondaryHref} className="sp_btn_o">
              {secondaryLabel}
            </Link>
          ) : (
            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="sp_btn_o"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
