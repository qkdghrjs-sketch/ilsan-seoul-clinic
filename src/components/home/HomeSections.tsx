import Link from "next/link";

import "./home.css";
import { CLINIC } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";
import { ULTRASOUNDS } from "@/lib/ultrasound";
import { getAllEssays } from "@/lib/essay-posts";
import { EXTERNAL } from "@/lib/nav";
import { formatNoticeDate, getNotices } from "@/lib/notices";

/*
  첫 화면 = 옛 홈페이지 대문 구성 (원장님 요청 2026-10-22·10-27)
  · 위 1/3: 「정확한 검사 · 친절한 진료 / 일산서울내과의원」(「서울」만 하늘색) + 꽃 로고
  · 아래: 바로가기 상자 6개
  · 맨 아래: 병원명·주소·전화 (SiteFooter 가 홈에서는 이 줄만 보여 줍니다)
  · PC에서는 한 화면에 고정되어 스크롤이 없습니다.
*/

/** 꽃 로고 — 원장님이 보내 주신 원본(로고.ai, 2026-10-28)을 SVG로 옮긴 것 */
export function FlowerLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src="/images/logo-flower.svg"
      alt={`${CLINIC.name} 로고`}
      width={387}
      height={370}
    />
  );
}

/*
  휴대폰 전용 작은 아이콘 (원장님 시안 2안, 2026-11-11)
  PC에서는 CSS로 숨깁니다.
*/
const HOME_ICONS = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  stomach: (
    <path d="M9 3v3a3 3 0 0 1-1 2.2C6 10 5 12 5 14.5 5 18.6 8 21 11.5 21 16 21 19 18 19 13.5 19 10 17 8 14.5 8.5 12.5 9 12 8 12 6.5V3" />
  ),
  building: (
    <>
      <path d="M4 21V5l8-2v18M12 9h8v12" />
      <path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2M2 21h20" />
    </>
  ),
  feather: (
    <>
      <path d="M20 4C12 4 6 9 6 17v3" />
      <path d="M20 4c0 8-5 13-12 13M10 13h6" />
    </>
  ),
  probe: (
    <>
      <path d="M9 3h6v8a3 3 0 0 1-6 0z" />
      <path d="M12 14v3a3 3 0 0 0 3 3h4" />
      <path d="M17 4a5 5 0 0 1 0 6M19.5 2a8.5 8.5 0 0 1 0 10" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  ),
  carotid: <path d="M12 21V11M12 11L7 3M12 11l5-8M9.5 7L6 8M14.5 7L18 8" />,
  thyroid: (
    <path d="M12 9c-1-3-3-5-5-5S4 6.5 4 10s1.5 9 4 9 3-3 4-6c1 3 1.5 6 4 6s4-5.5 4-9-1-6-3-6-4 2-5 5z" />
  ),
  liver: (
    <path d="M3 9c0-3 3-4 7-4h7c3 0 4 2 4 4 0 4-4 6-8 8-2 1-4 2-5 2-3 0-5-3-5-10z" />
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
};
type HomeIconName = keyof typeof HOME_ICONS;

function HomeIcon({ name, className = "hm_ico" }: { name: HomeIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {HOME_ICONS[name]}
    </svg>
  );
}

const US_ICON: Record<string, HomeIconName> = {
  heart: "heart",
  carotid: "carotid",
  thyroid: "thyroid",
  abdomen: "liver",
};

/** 상자 머리 — 제목 + 영문 + 더보기 */
function BoxHead({
  title,
  en,
  href,
  icon,
}: {
  title: string;
  en: string;
  href: string;
  icon?: HomeIconName;
}) {
  return (
    <div className="hm_box_head">
      <Link href={href} className="hm_box_title">
        {icon && <HomeIcon name={icon} />}
        {title}
        <span>{en}</span>
      </Link>
      <Link href={href} className="hm_box_more" aria-label={`${title} 더보기`}>
        MORE
      </Link>
    </div>
  );
}

export async function HomeGate() {
  const essays = (await getAllEssays()).slice(0, 6);
  // 원장님 요청(2026-11-12): 휴대폰 첫 화면 아래 「본원 둘러보기」 자리에 공지사항
  const notices = (await getNotices().catch(() => [])).slice(0, 6);

  return (
    <section className="hm_gate" aria-label={`${CLINIC.name} 첫 화면`}>
      {/* 1. 대문 띠 */}
      <div className="hm_banner">
        <div className="hm_banner_text">
          <p className="hm_banner_slogan">정확한 검사 · 친절한 진료</p>
          <h2 className="hm_banner_name" aria-label={CLINIC.name}>
            일산<em>서울</em>내과의원
          </h2>
        </div>
        <FlowerLogo className="hm_banner_logo" />
      </div>

      {/*
        2. 바로가기 상자 6개 — 옛 홈페이지 배치 그대로
           윗줄: 원장님 소개 | 수면 위내시경 | 김금미 에세이
           아랫줄: 본원 둘러보기 | 초음파 검사 | 찾아오시는 길(주소·전화, 에세이 바로 밑)
      */}
      <div className="hm_boxes">
        <article className="hm_box a_doc">
          <BoxHead title="원장님 소개" en="DOCTOR" href="/doctor" icon="user" />
          <Link href="/doctor" className="hm_box_body">
            <span className="hm_thumb portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DOCTOR.photo} alt={`${DOCTOR.name} 사진`} />
            </span>
            <span className="hm_box_text">
              <strong>{DOCTOR.name}</strong>
              <span className="hm_doc_grad hm_doc_bold">이화여자대학교 의과대학 졸업</span>
              {/* 원장님 요청(2026-11-12): 휴대폰에서도 4가지가 한 줄씩 보이게 */}
              <span className="hm_doc_bold hm_doc_spec">
                <span>내과 전문의</span>
                <i aria-hidden="true"> · </i>
                <span>의학박사</span>
              </span>
              <span className="hm_doc_cert">
                <span>소화기내시경 세부전문의</span>
                <span>심장초음파 세부인증의</span>
              </span>
            </span>
          </Link>
        </article>

        <article className="hm_box a_endo feature">
          <BoxHead title="수면 위내시경 검사" en="ENDOSCOPY" href="/endoscopy" icon="stomach" />
          {/* 원장님 요청(2026-11-12): 위내시경 사진 2장 */}
          <Link href="/endoscopy" className="hm_box_body hm_endo_body">
            <span className="hm_endo_pics">
              <span className="hm_thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/endo/endo-1.jpg" alt="위내시경 검사 화면 예시 1" />
              </span>
              <span className="hm_thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/endo/endo-2.jpg" alt="위내시경 검사 화면 예시 2" />
              </span>
            </span>
            <span className="hm_box_text">
              {/* 원장님 문구(2026-11-12) — 줄이지 않고 전부 보이게 */}
              <strong>위식도 내시경</strong>
              <span className="hm_endo_desc">
                식도, 위, 십이지장의 질환을 가장 정확하게 진단할 수 있는 검사
                방법은 위식도 내시경 검사입니다.
              </span>
            </span>
          </Link>
        </article>

        <article className="hm_box a_essay">
          <BoxHead title="김금미 에세이" en="ESSAY" href="/essay" icon="feather" />
          <ul className="hm_essay_list">
            {essays.map((item) => (
              <li key={item.id}>
                <Link href={`/essay/${item.id}`}>
                  <span>{item.title}</span>
                  <time>{item.date.replace(/-/g, ".").slice(2)}</time>
                </Link>
              </li>
            ))}
          </ul>
          {/* 원장님 요청(2026-10-28): 에세이 아래 빈 곳에 오시는 길 — PC에서만 (휴대폰은 아래 상자) */}
          <div className="hm_essay_loc">
            <Link href="/location" className="hm_essay_loc_head">
              오시는 길
              <span>LOCATION</span>
            </Link>
            <Link href="/location" className="hm_loc">
              <span className="hm_loc_addr">{CLINIC.address.full}</span>
              <span className="hm_loc_sub">지하철 3호선 주엽역 인근 · 롯데마트 근처</span>
              <span className="hm_tel">TEL. {CLINIC.telephoneDisplay}</span>
            </Link>
            <div className="hm_map_links">
              <a href={EXTERNAL.naverMap} target="_blank" rel="noopener noreferrer">
                네이버 지도
              </a>
              <a href={EXTERNAL.kakaoMap} target="_blank" rel="noopener noreferrer">
                카카오맵
              </a>
            </div>
          </div>
        </article>

        <article className="hm_box a_notice">
          <BoxHead title="공지사항" en="NOTICE" href="/notice" icon="bell" />
          {notices.length ? (
            <ul className="hm_essay_list hm_notice_list">
              {notices.map((item) => (
                <li key={item.id}>
                  <Link href={`/notice/${item.id}`}>
                    <span>{item.title}</span>
                    <time>{formatNoticeDate(item.createdAt).slice(2)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="hm_notice_empty">등록된 공지사항이 없습니다.</p>
          )}
        </article>

        <article className="hm_box a_tour">
          <BoxHead title="본원 둘러보기" en="TOUR" href="/tour" icon="building" />
          <Link href="/tour" className="hm_box_body two">
            <span className="hm_thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/tour/lobby.jpg" alt="접수 · 대기 공간" />
            </span>
            <span className="hm_thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/tour/clinic-room.jpg" alt="진료실" />
            </span>
          </Link>
        </article>

        <article className="hm_box a_us">
          <BoxHead title="초음파 검사" en="ULTRASOUND" href="/ultrasound" />
          {/* 휴대폰 2안: 남색 제목 띠 (PC는 숨김) */}
          <Link href="/ultrasound" className="hm_us_band">
            <HomeIcon name="probe" />
            <strong>초음파 검사</strong>
            <span>심장 · 경동맥 · 갑상선 · 복부</span>
          </Link>
          {/* 원장님 요청(2026-11-11): 휴대폰에서는 대표 초음파 사진을 함께 보여 줍니다 (PC는 글자 버튼 그대로) */}
          <div className="hm_us_links">
            {ULTRASOUNDS.map((item) => (
              <Link key={item.slug} href={`/ultrasound#${item.slug}`}>
                <span className="hm_us_img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/us/home-${item.slug}.jpg`} alt={`${item.label} 검사 화면 예시`} />
                </span>
                <span className="hm_us_label">
                  <HomeIcon name={US_ICON[item.slug] ?? "heart"} />
                  <span>{item.label.replace(/\s*초음파$/, "")}</span> <span>초음파</span>
                </span>
              </Link>
            ))}
          </div>
        </article>

        <article className="hm_box a_loc">
          <BoxHead title="찾아오시는 길" en="LOCATION" href="/location" />
          {/* 휴대폰 2안: 한 줄 (아이콘 · 주소 · 전화) */}
          <Link href="/location" className="hm_loc_row">
            <span className="hm_loc_row_title">
              <HomeIcon name="pin" />
              찾아오시는 길
            </span>
            <span className="hm_loc_row_addr">{CLINIC.address.full}</span>
            <span className="hm_loc_row_tel">
              <HomeIcon name="phone" />
              TEL. {CLINIC.telephoneDisplay}
            </span>
          </Link>
          <Link href="/location" className="hm_loc">
            <span className="hm_loc_addr">{CLINIC.address.full}</span>
            <span className="hm_loc_sub">지하철 3호선 주엽역 인근 · 롯데마트 근처</span>
            <span className="hm_tel">TEL. {CLINIC.telephoneDisplay}</span>
          </Link>
        </article>
      </div>
    </section>
  );
}