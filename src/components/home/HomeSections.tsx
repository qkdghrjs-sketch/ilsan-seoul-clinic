import Link from "next/link";

import "./home.css";
import Reveal from "@/components/Reveal";
import Icon, { type IconName } from "@/components/subpage/icons";
import { CLINIC } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";
import { CHECKUPS } from "@/lib/checkups";

const CheckMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ══════════════════════════════════════════════
   1. 히어로 — 30년 진료 경력의 여의사 원장
══════════════════════════════════════════════ */
export function HomeHero() {
  return (
    <section className="hm_hero">
      <Reveal className="hm_hero_inner" selector=".rv">
        <div>
          <span className="rv hm_eyebrow">
            <i />
            ILSAN SEOUL INTERNAL MEDICINE
          </span>
          <h2 className="rv d2 hm_hero_title">
            30년 진료 경력의
            <br />
            <b>여의사 원장</b>이
            <br />
            직접 진료합니다
          </h2>
          <p className="rv d3 hm_hero_sub">
            일산서울내과의원은 1989년 이화여자대학교 의과대학을 졸업하고 30년
            이상 내과 진료를 이어온 김금미 원장이 진료합니다. 수면 위내시경부터
            고혈압·당뇨·간염 정기검사, 국민건강보험공단 검진까지 한 곳에서
            확인하실 수 있습니다.
          </p>
          <div className="rv d4 hm_hero_btns">
            <a href={`tel:${CLINIC.telephoneDisplay}`} className="hm_btn_p">
              <Icon name="phone" size={16} />
              {CLINIC.telephoneDisplay} 상담·예약
            </a>
            <Link href="/endoscopy" className="hm_btn_o">
              수면 위내시경 안내
            </Link>
          </div>
        </div>

        <div className="rv d3 hm_hero_card">
          <span className="hm_card_label">OUR DOCTOR</span>
          <p className="hm_card_name">{DOCTOR.name}</p>
          <p className="hm_card_role">{DOCTOR.position}</p>
          <div className="hm_card_line" />
          <div className="hm_card_list">
            {DOCTOR.highlights.map((item) => (
              <span className="hm_card_item" key={item}>
                <CheckMark />
                {item}
              </span>
            ))}
          </div>
          <Link href="/doctor" className="hm_card_more">
            원장님 약력 자세히 보기 →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════
   2. 신뢰 지표
══════════════════════════════════════════════ */
const STATS = [
  { num: "1989", label: "이화여자대학교\n의과대학 졸업" },
  { num: "30년+", label: "내과 진료 경력" },
  { num: "1999", label: "소화기내시경\n전문의 수료" },
  { num: "1:1", label: "내시경 시 한 시간 간격\n한 분씩 검사" },
];

export function HomeStats() {
  return (
    <section className="hm_stats">
      <div className="hm_stats_inner">
        {STATS.map((stat) => (
          <div className="hm_stat" key={stat.num + stat.label}>
            <strong className="hm_stat_num">{stat.num}</strong>
            <span className="hm_stat_lbl">
              {stat.label.split("\n").map((line, index) => (
                <span key={index} style={{ display: "block" }}>
                  {line}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   3. 진료 안내 카드
══════════════════════════════════════════════ */
type ServiceCard = {
  icon: IconName;
  title: string;
  desc: string;
  tags: string[];
  href: string;
  /** 카드마다 다른 강조색 — 파랑·청록 계열 안에서만 변주합니다 */
  accent: string;
};

const SERVICES: ServiceCard[] = [
  {
    icon: "eye",
    title: "수면 위 내시경",
    desc: "잠이 든 상태에서 5~10분간 검사하여 불편감을 줄입니다. 검사 후 촬영한 영상으로 결과를 함께 확인합니다.",
    tags: ["예약제", "당일 결과 확인", "자동소독기 소독"],
    href: "/endoscopy",
    accent: "#2b5ba8",
  },
  {
    icon: "list",
    title: "수면 위 내시경 FAQ",
    desc: "가능한 연령대, 소요 시간, 금식 시간, 복용 중인 약 처리까지 자주 묻는 10가지 질문에 답해 드립니다.",
    tags: ["금식 안내", "고혈압·당뇨 복약", "예약 방법"],
    href: "/endoscopy/faq",
    accent: "#2e9580",
  },
  {
    icon: "checkCircle",
    title: "검사안내",
    desc: "고혈압·당뇨병·B형간염 정기검사와 국민건강보험공단 검진, 정밀종합검사를 원장이 직접 시행하고 결과를 설명합니다.",
    tags: ["6개월 정기검사", "공단검진", "정밀종합검사"],
    href: "/checkup",
    accent: "#2f9fc4",
  },
];

export function HomeServices() {
  return (
    <section className="hm_sec">
      <span className="hm_orb a" aria-hidden="true" />
      <span className="hm_orb b" aria-hidden="true" />
      <Reveal className="hm_inner" selector=".rv">
        <div className="rv hm_hd">
          <span className="hm_hd_eyebrow">MEDICAL SERVICE</span>
          <h2 className="hm_hd_title">
            불편한 검사가 아니라,
            <br />
            제대로 확인하는 검사
          </h2>
          <p className="hm_hd_desc">
            검사는 받는 것으로 끝나지 않습니다. 일산서울내과의원은 검사 결과를
            원장이 직접 확인하고 설명한 뒤, 필요한 치료까지 이어서 볼 수 있도록
            진료합니다.
          </p>
        </div>

        <div className="hm_grid">
          {SERVICES.map((card, index) => (
            <Link
              href={card.href}
              key={card.title}
              className={`rv d${index + 2} hm_card`}
              data-accent=""
              style={{ "--accent": card.accent } as React.CSSProperties}
            >
              <span className="hm_card_icon">
                <Icon name={card.icon} />
              </span>
              <h3 className="hm_card_title">{card.title}</h3>
              <p className="hm_card_desc">{card.desc}</p>
              <div className="hm_card_tags">
                {card.tags.map((tag) => (
                  <span className="hm_tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="hm_card_link">자세히 보기 →</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════
   4. 원장 소개 요약
══════════════════════════════════════════════ */
export function HomeDoctor() {
  return (
    <section className="hm_sec alt">
      <span className="hm_orb a" aria-hidden="true" />
      <Reveal className="hm_inner" selector=".rv">
        <div className="hm_doc">
          <div className="rv">
            <span className="hm_hd_eyebrow">OUR DOCTOR</span>
            <p className="hm_doc_quote">
              {DOCTOR.quote[0]}
              <br />
              {DOCTOR.quote[1]}
            </p>
            <p className="hm_doc_sign">
              <b>{DOCTOR.name}</b>
              <br />
              {DOCTOR.current.join(" · ")}
            </p>
            <Link href="/doctor" className="hm_doc_btn">
              원장님 소개 보기
              <span>→</span>
            </Link>
          </div>

          <div className="rv d2">
            <div className="hm_doc_rows">
              {DOCTOR.career.map((item) => (
                <div className="hm_doc_row" key={item.year + item.text}>
                  <span className="hm_doc_year">{item.year}</span>
                  <span className="hm_doc_text">{item.text}</span>
                </div>
              ))}
              {DOCTOR.awards.map((item) => (
                <div className="hm_doc_row" key={`award-${item.year}`}>
                  <span className="hm_doc_year">{item.year}</span>
                  <span className="hm_doc_text">{item.text} 수상</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════
   5. 검사안내 목록
══════════════════════════════════════════════ */
const CHECKUP_ACCENTS = [
  "#1a3a6c",
  "#2b5ba8",
  "#2f9fc4",
  "#2e9580",
  "#4bb89c",
];

const CHECKUP_LINKS = [
  ...CHECKUPS.map((item) => ({
    href: item.path,
    title: item.label,
    sub: item.summary,
  })),
  {
    href: "/checkup/nhis",
    title: "국민공단검진",
    sub: "일반건강검진 · 위암/간암 검진 · 생애전환기 건강진단",
  },
  {
    href: "/checkup/premium",
    title: "정밀종합검사",
    sub: "내시경·초음파·혈액 51종·암 표지자까지 한 번에",
  },
];

export function HomeCheckups() {
  return (
    <section className="hm_sec">
      <span className="hm_orb b" aria-hidden="true" />
      <Reveal className="hm_inner" selector=".rv">
        <div className="rv hm_hd">
          <span className="hm_hd_eyebrow">CHECK-UP</span>
          <h2 className="hm_hd_title">검사안내</h2>
          <p className="hm_hd_desc">
            지금 필요한 검사가 무엇인지, 어떤 항목을 보는지 미리 확인하고
            오시면 진료 시간이 훨씬 여유로워집니다.
          </p>
        </div>

        <div className="hm_list">
          {CHECKUP_LINKS.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              className={`rv d${Math.min(index + 2, 5)} hm_item`}
              data-accent=""
              style={
                {
                  "--accent": CHECKUP_ACCENTS[index % CHECKUP_ACCENTS.length],
                } as React.CSSProperties
              }
            >
              <span className="hm_item_no">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hm_item_body">
                <span className="hm_item_title">{item.title}</span>
                <span className="hm_item_sub">{item.sub}</span>
              </span>
              <span className="hm_item_arrow">→</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════
   6. 전화 CTA
══════════════════════════════════════════════ */
export function HomeCta() {
  return (
    <section className="hm_cta">
      <Reveal className="hm_inner" selector=".rv">
        <h2 className="rv hm_cta_title">
          검사 예약과 진료 문의는
          <br />
          전화로 편하게 연락 주세요
        </h2>
        <p className="rv d2 hm_cta_sub">
          수면 위내시경은 예약제로 운영됩니다.
          <br />
          {CLINIC.address.full}
        </p>
        <div className="rv d3 hm_cta_btns">
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="hm_btn_p">
            <Icon name="phone" size={16} />
            {CLINIC.telephoneDisplay}
          </a>
          <Link href="/location" className="hm_btn_o">
            진료시간 · 오시는 길
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
