import { ESSAYS, type Essay } from "@/lib/essays";
import { readJson, writeJson } from "@/lib/store";

/**
 * 원장님이 /admin 에서 새로 올리는 에세이.
 *
 * - 옛 홈페이지에서 옮겨 온 8편은 코드(src/lib/essays.ts)에 그대로 있고, 여기서 고치지 않습니다.
 * - 새 글은 저장소(src/lib/store.ts)에 들어 있다가, 목록·상세·첫 화면에서 옛 글과 합쳐 보입니다.
 * - 사진 첨부는 아직 없습니다. (글만)
 */

export type EssayPost = {
  id: string;
  title: string;
  /** 화면에 보이는 날짜 YYYY.MM.DD (원장님이 고름) */
  date: string;
  /** 신문·잡지에 낸 글이면 출처 (선택) */
  source: string | null;
  /** 문단은 빈 줄로 나눕니다 */
  body: string;
  createdAt: string;
  updatedAt: string;
};

const NAME = "essays";

export async function getEssayPosts(): Promise<EssayPost[]> {
  const list = await readJson<EssayPost[]>(NAME, []);
  return (Array.isArray(list) ? list : []).sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}

function toEssay(post: EssayPost): Essay {
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);
  const first = paragraphs[0] ?? "";
  return {
    id: post.id,
    title: post.title,
    date: post.date,
    source: post.source,
    sourceUrl: null,
    excerpt: first.length > 70 ? `${first.replace(/\s+/g, " ").slice(0, 70)}…` : first.replace(/\s+/g, " "),
    blocks: paragraphs.map((text) => ({ type: "p" as const, text })),
  };
}

/** 새 글 + 옛 글을 합쳐 최신 날짜순으로 */
export async function getAllEssays(): Promise<Essay[]> {
  const fresh = (await getEssayPosts()).map(toEssay);
  return [...fresh, ...ESSAYS].sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export async function findEssayAny(id: string) {
  return (await getAllEssays()).find((item) => String(item.id) === id) ?? null;
}

export async function saveEssayPost(input: {
  id?: string;
  title: string;
  date: string;
  source: string | null;
  body: string;
}) {
  const list = await getEssayPosts();
  const now = new Date().toISOString();

  if (input.id) {
    const index = list.findIndex((item) => item.id === input.id);
    if (index === -1) throw new Error("수정할 에세이를 찾지 못했습니다.");
    list[index] = {
      ...list[index],
      title: input.title,
      date: input.date,
      source: input.source,
      body: input.body,
      updatedAt: now,
    };
    await writeJson(NAME, list);
    return list[index];
  }

  const created: EssayPost = {
    id: `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    title: input.title,
    date: input.date,
    source: input.source,
    body: input.body,
    createdAt: now,
    updatedAt: now,
  };
  await writeJson(NAME, [...list, created]);
  return created;
}

export async function removeEssayPost(id: string) {
  const list = await getEssayPosts();
  await writeJson(
    NAME,
    list.filter((item) => item.id !== id),
  );
}
