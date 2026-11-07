import { readJson, updateJson } from "@/lib/store";

/**
 * 김금미 에세이 조회수 (원장님 요청 2026-11-02).
 *
 * 화면 조회수 = 옛 홈페이지 조회수(아래 고정값) + 이 사이트에서 늘어난 수(저장소 `views/views.json`).
 * - 옛 조회수: iseoulmed.com/board/board_list.asp 목록을 2026-11-07 전환 직전에 다시 읽은 값. 키는 옛 게시판 글 번호(srno)와 같은 id.
 * - 원장님이 새로 올린 글은 옛 조회수 없이 0 부터.
 * - 같은 브라우저에서 같은 글은 하루 한 번만 셉니다(새로고침으로 늘지 않게, 화면 쪽 EssayViewCounter).
 * - 검색엔진 로봇은 화면 스크립트를 실행하지 않아 세지 않습니다.
 */
export const LEGACY_VIEWS: Record<string, number> = {
  "8": 6484, // 어머니의 달력
  "7": 6159, // 청진기 단상
  "6": 10450, // 왕따 의사의 진료실 풍경
  "5": 30788, // 눈높이 공단검진
  "4": 10476, // 교영이의 졸업식날
  "3": 9101, // 필경사 가는길
  "2": 6785, // [조선일보 기고] 정이 고픈 사람들
  "1": 5311, // 병을 친구처럼
};

const NAME = "views";
type Counts = Record<string, number>;

async function readAdded(): Promise<Counts> {
  const data = await readJson<Counts>(NAME, {});
  return data && typeof data === "object" ? data : {};
}

/** 글 id 별 화면 조회수 */
export async function getEssayViews(): Promise<Counts> {
  const added = await readAdded();
  const result: Counts = { ...LEGACY_VIEWS };
  for (const [id, n] of Object.entries(added)) {
    if (Number.isFinite(n)) result[id] = (result[id] ?? 0) + n;
  }
  return result;
}

export async function getEssayView(id: string) {
  return (await getEssayViews())[id] ?? 0;
}

/** 조회 1 늘리고 새 조회수를 돌려줍니다. (동시에 열어도 빠지지 않게 updateJson 사용) */
export async function addEssayView(id: string) {
  const next = await updateJson<Counts>(NAME, {}, (current) => {
    const added = current && typeof current === "object" ? { ...current } : {};
    added[id] = (Number.isFinite(added[id]) ? added[id] : 0) + 1;
    return added;
  });
  return (LEGACY_VIEWS[id] ?? 0) + next[id];
}
