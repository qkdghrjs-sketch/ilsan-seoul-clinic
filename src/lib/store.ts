import { get, put } from "@vercel/blob";

/**
 * 글 저장소 (공지사항·에세이가 함께 씁니다).
 *
 * 운영(Vercel): Vercel Blob 저장소의 JSON 파일 한 개 (`<이름>/<이름>.json`)
 *   - Vercel 프로젝트에 Blob 저장소를 연결하면 BLOB_READ_WRITE_TOKEN 이 자동으로 생깁니다.
 *   - 저장소가 연결되지 않으면 글은 「없음」으로 보이고, 관리자 화면에 안내가 뜹니다.
 * 내 컴퓨터(개발): 저장소 연결 없이도 .data/<이름>.json 파일로 똑같이 동작합니다.
 */

export type StorageMode = "blob" | "file" | "none";

export function storageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.NODE_ENV !== "production") return "file";
  return "none";
}

/** 저장소를 만들 때 Private/Public 중 무엇을 골랐는지 모르므로 둘 다 시도합니다. */
let blobAccess: "private" | "public" | null = null;

function accessOrder(): Array<"private" | "public"> {
  return blobAccess ? [blobAccess] : ["private", "public"];
}

const blobPath = (name: string) => `${name}/${name}.json`;
const localPath = (name: string) => `.data/${name}.json`;

async function blobRead<T>(name: string, fallback: T): Promise<T> {
  let lastError: unknown = null;
  for (const access of accessOrder()) {
    try {
      const result = await get(blobPath(name), { access, useCache: false });
      blobAccess = access;
      if (!result || result.statusCode !== 200) return fallback;
      return JSON.parse(await new Response(result.stream).text()) as T;
    } catch (error) {
      lastError = error;
    }
  }
  console.error(`[store] ${name} 읽기 실패`, lastError);
  return fallback;
}

async function blobWrite(name: string, data: unknown) {
  let lastError: unknown = null;
  for (const access of accessOrder()) {
    try {
      await put(blobPath(name), JSON.stringify(data), {
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

async function fileRead<T>(name: string, fallback: T): Promise<T> {
  const { readFile } = await import("node:fs/promises");
  try {
    return JSON.parse(await readFile(localPath(name), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

async function fileWrite(name: string, data: unknown) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(".data", { recursive: true });
  await writeFile(localPath(name), JSON.stringify(data, null, 2), "utf-8");
}

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  const mode = storageMode();
  if (mode === "blob") return blobRead(name, fallback);
  if (mode === "file") return fileRead(name, fallback);
  return fallback;
}

/**
 * 읽고-고치고-쓰기를 안전하게 (조회수처럼 여러 사람이 동시에 바꾸는 값).
 * - 운영(Blob): 읽은 뒤 다른 사람이 먼저 바꿨으면(ETag 다름) 다시 읽어서 재시도합니다.
 * - 읽기 자체가 실패하면 쓰지 않습니다(빈 값으로 덮어써 숫자가 지워지는 일 방지).
 */
export async function updateJson<T>(name: string, fallback: T, change: (current: T) => T): Promise<T> {
  const mode = storageMode();
  if (mode === "file") {
    const next = change(await fileRead(name, fallback));
    await fileWrite(name, next);
    return next;
  }
  if (mode !== "blob") throw new Error("저장소가 연결되지 않았습니다.");

  for (let attempt = 0; attempt < 6; attempt++) {
    // 1) 읽기 — 실패하면 예외를 그대로 던져 쓰지 않습니다.
    let found: { data: T; etag: string } | null = null;
    let access: "private" | "public" | null = null;
    let lastError: unknown = null;
    for (const candidate of accessOrder()) {
      try {
        const result = await get(blobPath(name), { access: candidate, useCache: false });
        access = candidate;
        if (result && result.statusCode === 200) {
          found = {
            data: JSON.parse(await new Response(result.stream).text()) as T,
            etag: result.blob.etag,
          };
        }
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (!access) throw lastError;
    blobAccess = access;

    // 2) 쓰기 — 있던 파일이면 ETag 가 같을 때만, 없던 파일이면 새로 만들 때만.
    const next = change(found ? found.data : fallback);
    try {
      await put(blobPath(name), JSON.stringify(next), {
        access,
        addRandomSuffix: false,
        contentType: "application/json",
        ...(found ? { allowOverwrite: true, ifMatch: found.etag } : { allowOverwrite: false }),
      });
      return next;
    } catch (error) {
      lastError = error;
      // 다른 사람이 먼저 바꿨음 → 잠깐 쉬고 다시 읽기
      await new Promise((resolve) => setTimeout(resolve, 60 + Math.random() * 140));
    }
  }
  throw new Error(`[store] ${name} 저장 재시도 초과`);
}

export async function writeJson(name: string, data: unknown) {
  const mode = storageMode();
  if (mode === "blob") return blobWrite(name, data);
  if (mode === "file") return fileWrite(name, data);
  throw new Error("저장소가 연결되지 않았습니다.");
}
