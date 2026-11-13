import { randomBytes } from "node:crypto";
import { del, get, put } from "@vercel/blob";

import { storageMode } from "@/lib/store";

/**
 * 공지사항 사진 (원장님 요청 2026-11-13).
 *
 * - 원장님이 글쓰기 화면에서 올린 사진만 저장합니다. 환자가 올리는 기능은 없습니다.
 * - 올리기 전에 브라우저가 사진을 줄여서 JPEG로 바꿉니다(촬영 위치 같은 사진 속 정보도 이때 빠집니다).
 * - 운영(Vercel): 글과 같은 Blob 저장소의 `notice-images/<이름>.jpg`
 *   내 컴퓨터(개발): `.data/notice-images/<이름>.jpg`
 * - 화면에는 `/api/notice-image/<이름>.jpg` 주소로 보여 줍니다.
 */

export type NoticeImage = {
  /** /api/notice-image/<이름>.jpg */
  url: string;
  /** 사진 가로·세로(px) — 자리를 미리 잡아 화면이 덜컹거리지 않게 */
  w: number;
  h: number;
  /** 본문 속 자리 표시 번호 — 「[사진 1]」의 1 (없으면 글 맨 아래에 보임) */
  n?: number;
};

/** 글 하나에 넣을 수 있는 사진 수 */
export const NOTICE_IMAGE_MAX = 5;
/** 줄인 뒤 사진 한 장의 최대 크기 */
export const NOTICE_IMAGE_BYTES = 3 * 1024 * 1024;

const NAME_RE = /^[a-f0-9]{24}\.jpg$/;
const URL_PREFIX = "/api/notice-image/";

export const isImageName = (name: string) => NAME_RE.test(name);

const blobPath = (name: string) => `notice-images/${name}`;
const localPath = (name: string) => `.data/notice-images/${name}`;

/** JPEG 파일인지 맨 앞 3바이트로 확인합니다 */
export function looksLikeJpeg(bytes: Uint8Array) {
  return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

/** 폼에서 넘어온 사진 목록을 검사해 우리 주소만 남깁니다 */
export function cleanImages(value: unknown): NoticeImage[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const list: NoticeImage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const { url, w, h, n } = item as { url?: unknown; w?: unknown; h?: unknown; n?: unknown };
    if (typeof url !== "string" || !url.startsWith(URL_PREFIX)) continue;
    if (!isImageName(url.slice(URL_PREFIX.length)) || seen.has(url)) continue;
    const width = Math.round(Number(w));
    const height = Math.round(Number(h));
    if (!(width >= 1 && width <= 6000 && height >= 1 && height <= 6000)) continue;
    seen.add(url);
    const number = Math.round(Number(n));
    list.push({
      url,
      w: width,
      h: height,
      ...(number >= 1 && number <= 99 ? { n: number } : {}),
    });
    if (list.length >= NOTICE_IMAGE_MAX) break;
  }
  return list;
}

/** 저장소를 만들 때 Private/Public 중 무엇을 골랐는지 모르므로 둘 다 시도합니다 (store.ts 와 같은 방식) */
let blobAccess: "private" | "public" | null = null;
const accessOrder = (): Array<"private" | "public"> =>
  blobAccess ? [blobAccess] : ["private", "public"];

/** 사진 한 장 저장 → 화면에 쓸 주소 */
export async function saveNoticeImage(bytes: Uint8Array): Promise<string> {
  const name = `${randomBytes(12).toString("hex")}.jpg`;
  const mode = storageMode();

  if (mode === "file") {
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(".data/notice-images", { recursive: true });
    await writeFile(localPath(name), bytes);
    return URL_PREFIX + name;
  }
  if (mode !== "blob") throw new Error("저장소가 연결되지 않았습니다.");

  let lastError: unknown = null;
  for (const access of accessOrder()) {
    try {
      await put(blobPath(name), Buffer.from(bytes), {
        access,
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: "image/jpeg",
      });
      blobAccess = access;
      return URL_PREFIX + name;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

/** 사진 한 장 읽기 — 없으면 null */
export async function readNoticeImage(name: string): Promise<Uint8Array | null> {
  if (!isImageName(name)) return null;
  const mode = storageMode();

  if (mode === "file") {
    const { readFile } = await import("node:fs/promises");
    try {
      return new Uint8Array(await readFile(localPath(name)));
    } catch {
      return null;
    }
  }
  if (mode !== "blob") return null;

  for (const access of accessOrder()) {
    try {
      const result = await get(blobPath(name), { access });
      blobAccess = access;
      if (!result || result.statusCode !== 200) return null;
      return new Uint8Array(await new Response(result.stream).arrayBuffer());
    } catch {
      /* 다른 접근 방식으로 한 번 더 */
    }
  }
  return null;
}

/** 글에서 빠진 사진 지우기 — 실패해도 글 저장은 막지 않습니다 */
export async function removeNoticeImages(images: NoticeImage[]) {
  const names = images
    .map((image) => image.url.slice(URL_PREFIX.length))
    .filter(isImageName);
  if (!names.length) return;
  const mode = storageMode();
  try {
    if (mode === "file") {
      const { rm } = await import("node:fs/promises");
      await Promise.all(names.map((name) => rm(localPath(name), { force: true })));
    } else if (mode === "blob") {
      await del(names.map(blobPath));
    }
  } catch (error) {
    console.error("[notice-images] 사진 지우기 실패", error);
  }
}
