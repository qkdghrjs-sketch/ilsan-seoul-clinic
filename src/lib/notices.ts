import { readJson, storageMode, writeJson } from "@/lib/store";

/**
 * 공지사항 — 원장님이 /admin 에서 올립니다. (저장 방식은 src/lib/store.ts)
 * 공지는 환자가 읽는 공개 글입니다. 개인정보를 적지 않도록 관리자 화면에 안내합니다.
 */

export { storageMode };

export type Notice = {
  id: string;
  title: string;
  body: string;
  /** 위쪽에 고정(중요 공지·휴진 안내) */
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

const NAME = "notices";

/** 위에 고정된 글 먼저, 그다음 최신순 */
function sortNotices(list: Notice[]) {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function getNotices(): Promise<Notice[]> {
  const list = await readJson<Notice[]>(NAME, []);
  return sortNotices(Array.isArray(list) ? list : []);
}

export async function getNotice(id: string) {
  return (await getNotices()).find((item) => item.id === id) ?? null;
}

export async function saveNotice(input: {
  id?: string;
  title: string;
  body: string;
  pinned: boolean;
}) {
  const list = await getNotices();
  const now = new Date().toISOString();

  if (input.id) {
    const index = list.findIndex((item) => item.id === input.id);
    if (index === -1) throw new Error("수정할 공지를 찾지 못했습니다.");
    list[index] = {
      ...list[index],
      title: input.title,
      body: input.body,
      pinned: input.pinned,
      updatedAt: now,
    };
    await writeJson(NAME, list);
    return list[index];
  }

  const created: Notice = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    title: input.title,
    body: input.body,
    pinned: input.pinned,
    createdAt: now,
    updatedAt: now,
  };
  await writeJson(NAME, [...list, created]);
  return created;
}

export async function removeNotice(id: string) {
  const list = await getNotices();
  await writeJson(
    NAME,
    list.filter((item) => item.id !== id),
  );
}

/** 2026-10-16T… → 2026.10.16 (한국 시간 기준) */
export function formatNoticeDate(iso: string) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${pick("year")}.${pick("month")}.${pick("day")}`;
}
