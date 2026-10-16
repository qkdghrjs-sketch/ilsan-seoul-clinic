import type { IconName } from "@/components/subpage/icons";

/**
 * 수액 치료센터 콘텐츠 — 원장님 「내용정리.hwp」(2026-10-15) 기준.
 *
 * ※ 수액 종류·성분·용도는 원장님이 적어 주신 것만 담았습니다.
 *    용도를 적어 주지 않은 수액은 purpose 를 비워 두었습니다. (지어내지 않기)
 * ※ "빠른 개선", "기억력 향상"처럼 효과를 단정하는 문구는
 *    의료광고 기준에 맞춰 "도움을 드립니다"로 완화했습니다.
 * ※ 가격·소요시간은 받은 자료가 없어 적지 않았습니다.
 */

export type IvItem = {
  id: string;
  title: string;
  icon: IconName;
  /** 어떤 때 찾는 수액인지 (원장님이 적어 준 경우에만) */
  purpose?: string;
  /** 들어가는 성분 (원장님이 적어 준 경우에만) */
  contents: string[];
};

export const IV_ITEMS: IvItem[] = [
  {
    id: "cold",
    title: "감기수액",
    icon: "pill",
    purpose: "감기몸살 증상 완화에 도움을 드립니다.",
    contents: ["활성 비타민", "해열제"],
  },
  {
    id: "senior",
    title: "어르신 수액",
    icon: "heart",
    contents: ["영양제", "멀티비타민"],
  },
  {
    id: "student",
    title: "수험생 수액",
    icon: "brain",
    purpose: "수험생의 스트레스 완화에 도움을 드립니다.",
    contents: [],
  },
  {
    id: "liver",
    title: "간보충 수액",
    icon: "leaf",
    purpose: "질병 회복기와 숙취로 지친 몸의 회복에 도움을 드립니다.",
    contents: ["영양제", "비타민", "태반주사"],
  },
  {
    id: "chronic",
    title: "신경통 만성질환 수액",
    icon: "pulse",
    contents: ["영양제", "아연", "미네랄"],
  },
  {
    id: "premium",
    title: "프리미엄 집중 수액",
    icon: "sun",
    purpose: "과로한 업무로 지친 몸의 피로 회복에 도움을 드립니다.",
    contents: [
      "태반주사",
      "고용량 비타민 B·C",
      "미네랄",
      "영양제",
      "감초주사",
    ],
  },
  {
    id: "senior-plus",
    title: "어르신 집중 수액",
    icon: "drop",
    contents: ["영양제", "탄수화물", "오메가3 지방산"],
  },
];
