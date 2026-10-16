/**
 * 사이트 전체 메뉴 구조.
 * 헤더·푸터·사이트맵·브레드크럼·llms.txt 가 모두 이 한 곳을 참조합니다.
 */

export type NavChild = {
  label: string;
  /** 헤더 드롭다운에서만 줄바꿈이 필요한 경우 */
  labelPc?: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href: string;
  children: NavChild[];
};

export const NAV: NavGroup[] = [
  {
    label: "본원소개",
    href: "/doctor",
    children: [
      { label: "원장님 소개", href: "/doctor" },
      { label: "본원 둘러보기", href: "/tour" },
      { label: "찾아오시는 길", href: "/location" },
    ],
  },
  {
    label: "공지사항",
    href: "/notice",
    children: [{ label: "공지사항", href: "/notice" }],
  },
  {
    label: "수면 위내시경",
    href: "/endoscopy",
    children: [
      { label: "수면 위 내시경이란?", href: "/endoscopy" },
      { label: "수면 위 내시경 FAQ", href: "/endoscopy/faq" },
    ],
  },
  {
    label: "초음파검사",
    href: "/ultrasound",
    children: [
      { label: "초음파검사 안내", href: "/ultrasound" },
      { label: "심장 초음파", href: "/ultrasound/heart" },
      { label: "갑상선 초음파", href: "/ultrasound/thyroid" },
      { label: "경동맥 초음파", href: "/ultrasound/carotid" },
      { label: "복부 초음파", href: "/ultrasound/abdomen" },
    ],
  },
  {
    label: "검사안내",
    href: "/checkup",
    children: [
      { label: "검사안내 전체보기", href: "/checkup" },
      { label: "고혈압 정기검사", href: "/checkup/hypertension" },
      { label: "당뇨병 정기검사", href: "/checkup/diabetes" },
      { label: "B형간염 정기검사", href: "/checkup/hepatitis-b" },
      { label: "국민공단검진", href: "/checkup/nhis" },
      { label: "정밀종합검사", href: "/checkup/premium" },
    ],
  },
  {
    label: "수액 치료센터",
    href: "/iv",
    children: [{ label: "수액 치료센터 안내", href: "/iv" }],
  },
  {
    label: "김금미 에세이",
    href: "/essay",
    children: [{ label: "에세이 전체보기", href: "/essay" }],
  },
];

const QUERY = encodeURIComponent("일산서울내과의원");

/** 외부 지도 링크 (병원명 검색 결과로 연결) */
export const EXTERNAL = {
  naverMap: `https://map.naver.com/p/search/${QUERY}`,
  kakaoMap: `https://map.kakao.com/?q=${QUERY}`,
  tmap: `https://tmap.life/search?keyword=${QUERY}`,
} as const;

/** 경로 → 상위 그룹/현재 메뉴를 찾습니다 (브레드크럼용) */
export function findNavLocation(pathname: string) {
  for (const group of NAV) {
    const child = group.children.find((item) => item.href === pathname);
    if (child) return { group, child };
  }
  return null;
}
