import Link from "next/link";

import "./home.css";
import { CLINIC } from "@/lib/site";
import { DOCTOR } from "@/lib/doctor";
import { ULTRASOUNDS } from "@/lib/ultrasound";
import { getAllEssays } from "@/lib/essay-posts";

/*
  첫 화면 = 옛 홈페이지 대문 구성 (원장님 요청 2026-10-22·10-27)
  · 위 1/3: 「정확한 검사 · 친절한 진료 / 일산서울내과의원」 + 꽃 로고
  · 아래: 바로가기 상자 6개
  · 맨 아래: 병원명·주소·전화 (SiteFooter 가 홈에서는 이 줄만 보여 줍니다)
  · PC에서는 한 화면에 고정되어 스크롤이 없습니다.
*/

/** 꽃 로고 — 잎 다섯 장이 가운데를 감싸는 모양 */
export function FlowerLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-100 -100 200 200"
      role="img"
      aria-label={`${CLINIC.name} 로고`}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            className="petal"
            d="M0 -14 C 26 -30 34 -62 0 -94 C -34 -62 -26 -30 0 -14 Z"
          />
          <path className="vein" d="M0 -20 L0 -84" />
          <path className="vein" d="M0 -40 L13 -54 M0 -56 L12 -68 M0 -40 L-13 -54 M0 -56 L-12 -68" />
        </g>
      ))}
      <circle className="core" r="15" />
      <circle className="core_in" r="6" />
    </svg>
  );
}

/** 상자 머리 — 제목 + 영문 + 더보기 */
function BoxHead({
  title,
  en,
  href,
}: {
  title: string;
  en: string;
  href: string;
}) {
  return (
    <div className="hm_box_head">
      <Link href={href} className="hm_box_title">
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
  const essays = (await getAllEssays()).slice(0, 4);

  return (
    <section className="hm_gate" aria-label={`${CLINIC.name} 첫 화면`}>
      {/* 1. 대문 띠 */}
      <div className="hm_banner">
        <div className="hm_banner_text">
          <p className="hm_banner_slogan">정확한 검사 · 친절한 진료</p>
          <h2 className="hm_banner_name">{CLINIC.name}</h2>
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
          <BoxHead title="원장님 소개" en="DOCTOR" href="/doctor" />
          <Link href="/doctor" className="hm_box_body">
            <span className="hm_thumb portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DOCTOR.photo} alt={`${DOCTOR.name} 사진`} />
            </span>
            <span className="hm_box_text">
              <strong>{DOCTOR.name}</strong>
              <span>이화여자대학교 의과대학 졸업</span>
              <span className="pc_only">내과 전문의 · 의학박사</span>
            </span>
          </Link>
        </article>

        <article className="hm_box a_endo feature">
          <BoxHead title="수면 위내시경 검사" en="ENDOSCOPY" href="/endoscopy" />
          <Link href="/endoscopy" className="hm_box_body">
            <span className="hm_thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/endo/endo-1.jpg" alt="위내시경 검사 화면 예시" />
            </span>
            <span className="hm_box_text">
              <strong>위 식도 내시경</strong>
              <span className="clamp">
                식도, 위, 십이지장의 질환을 가장 정확하게 진단할 수 있는 검사
                방법입니다.
              </span>
            </span>
          </Link>
        </article>

        <article className="hm_box a_essay">
          <BoxHead title="김금미 에세이" en="ESSAY" href="/essay" />
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
        </article>

        <article className="hm_box a_tour">
          <BoxHead title="본원 둘러보기" en="TOUR" href="/tour" />
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
          <div className="hm_us_links">
            {ULTRASOUNDS.map((item) => (
              <Link key={item.slug} href={`/ultrasound#${item.slug}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </article>

        <article className="hm_box a_loc">
          <BoxHead title="찾아오시는 길" en="LOCATION" href="/location" />
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