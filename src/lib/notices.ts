import { get, put } from "@vercel/blob";

/**
 * 공지사항 저장소.
 *
 * 운영(Vercel): Vercel Blob 저장소의 JSON 파일 한 개 (notices/notices.json)
 *   - Vercel 프로젝트에 Blob 저장소를 연결하면 BLOB_READ_WRITE_TOKEN 이 자동으로 생깁니다.
 *   - 저장소가 연결되지 않으면 공지는 "없음"으로 보이고, 관리자 화면에 안내가 뜹니다.
 * 내 컴퓨터(개발): 저장소 연결 없이도 .data/notices.json 파일로 똑같이 동작합니다.
 *
 * 공지는 환자가 읽는 공개 글입니다. 개인정보를 적지 않도록 관리자 화면에 안내합니다.
 */

export type Notice = {
  id: string;
  title: string;
  body: string;
  /** 위쪽에 고정(중요 공지·휴진 안내) */
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

const BLOB_PATH = "notices/notices.json";
const LOCAL_PATH = ".data/notices.json";

export type StorageMode = "blob" | "file" | "none";

export function storageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.NODE_ENV !== "production") return "file";
  return "none";
}

/** 저장소를 만들 때 Private/Public 중 무엇을 골랐는지 모르므로 둘 다 시도합니다. */
let blobAccess: "private" | "public" | null = null;

async function blobRead(): Promise<Notice[]> {
  const order: Array<"private" | "public"> = blobAccess
    ? [blobAccess]
    : ["private", "public"];

  let lastError: unknown = null;
  for (const access of order) {
    try {
      const result = await get(BLOB_PATH, { access, useCache: false });
      blobAccess = access;
      if (!result || result.statusCode !== 200) return [];
      const text = await new Response(result.stream).text();
      const parsed = JSON.parse(text) as Notice[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      lastError = error;
    }
  }
  console.error("[notices] 공지 읽기 실패", lastError);
  return [];
}

async function blobWrite(list: Notice[]) {
  const order: Array<"private" | "public"> = blobAccess
    ? [blobAccess]
    : ["private", "public"];

  let lastError: unknown = null;
  for (const access of order) {
    try {
      await put(BLOB_PATH, JSON.stringify(list), {
        access,
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: "application/json",
      });
      blobAccess = access;
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function fileRead(): Promise<Notice[]> {
  const { readFile } = await import("node:fs/promises");
  try {
    const parsed = JSON.parse(await readFile(LOCAL_PATH, "utf-8")) as Notice[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fileWrite(list: Notice[]) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(".data", { recursive: true });
  await writeFile(LOCAL_PATH, JSON.stringify(list, null, 2), "utf-8");
}

/** 위에 고정된 글 먼저, 그다음 최신순 */
function sortNotices(list: Notice[]) {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function getNotices(): Promise<Notice[]> {
  const mode = storageMode();
  const list =
    mode === "blob" ? await blobRead() : mode === "file" ? await fileRead() : [];
  return sortNotices(list);
}

export async function getNotice(id: string) {
  return (await getNotices()).find((item) => item.id === id) ?? null;
}

async function writeAll(list: Notice[]) {
  const mode = storageMode();
  if (mode === "blob") return blobWrite(list);
  if (mode === "file") return fileWrite(list);
  throw new Error("저장소가 연결되지 않았습니다.");
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
    await writeAll(list);
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
  await writeAll([...list, created]);
  return created;
}

export async function removeNotice(id: string) {
  const list = await getNotices();
  await writeAll(list.filter((item) => item.id !== id));
}

/** 2026-10-16T… → 2026.10.16 (한국 시간 기준) */
export function formatNoticeDate(iso: string) {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${pick("year")}.${pick("month")}.${pick("day")}`;
}
