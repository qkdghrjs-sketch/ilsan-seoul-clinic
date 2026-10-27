"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  checkCredentials,
  clearFailures,
  endAdminSession,
  isAdmin,
  isAdminConfigured,
  isLockedOut,
  recordFailure,
  startAdminSession,
} from "@/lib/admin-auth";
import { removeNotice, saveNotice, storageMode } from "@/lib/notices";
import { removeEssayPost, saveEssayPost } from "@/lib/essay-posts";

export type FormState = { error?: string } | undefined;

const TITLE_MAX = 100;
const BODY_MAX = 5000;

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 로그인·저장 뒤 돌아갈 주소 — 우리 사이트 안의 주소만 받습니다 */
function safeNext(value: FormDataEntryValue | null, fallback: string) {
  const next = String(value ?? "");
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/** 관리자 로그인 */
export async function login(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "관리자 설정이 아직 끝나지 않았습니다. 담당자에게 문의해 주세요.",
    };
  }

  const ip = await clientIp();
  if (isLockedOut(ip)) {
    return {
      error: "로그인을 여러 번 실패해 잠시 막혔습니다. 15분 뒤에 다시 시도해 주세요.",
    };
  }

  const id = String(formData.get("id") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(id, password)) {
    recordFailure(ip);
    await wait(800); // 무작위 대입을 늦춥니다
    return { error: "아이디 또는 비밀번호가 맞지 않습니다." };
  }

  clearFailures(ip);
  await startAdminSession();
  redirect(safeNext(formData.get("next"), "/admin"));
}

/** 로그아웃 */
export async function logout(formData?: FormData) {
  await endAdminSession();
  redirect(safeNext(formData?.get("next") ?? null, "/admin"));
}

/** 공지 새로 쓰기 / 수정 */
export async function saveNoticeAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "로그인이 풀렸습니다. 다시 로그인해 주세요." };
  }
  if (storageMode() === "none") {
    return {
      error:
        "공지를 저장할 곳(Blob 저장소)이 아직 연결되지 않았습니다. 담당자에게 문의해 주세요.",
    };
  }

  const id = String(formData.get("id") ?? "").trim() || undefined;
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim();
  const pinned = formData.get("pinned") === "on";

  if (!title) return { error: "제목을 적어 주세요." };
  if (title.length > TITLE_MAX) {
    return { error: `제목은 ${TITLE_MAX}자 이내로 적어 주세요.` };
  }
  if (!body) return { error: "내용을 적어 주세요." };
  if (body.length > BODY_MAX) {
    return { error: `내용은 ${BODY_MAX.toLocaleString("ko-KR")}자 이내로 적어 주세요.` };
  }

  let savedId = "";
  try {
    const saved = await saveNotice({ id, title, body, pinned });
    savedId = saved.id;
    revalidatePath("/notice");
    revalidatePath(`/notice/${saved.id}`);
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
  } catch (error) {
    console.error("[admin] 공지 저장 실패", error);
    return { error: "저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요." };
  }

  // 글쓰기 화면에서 올리면 방금 올린 글로 바로 이동합니다
  redirect(
    formData.get("return") === "post" ? `/notice/${savedId}` : "/admin?saved=1",
  );
}

/** 공지 삭제 */
export async function deleteNoticeAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");

  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await removeNotice(id);
      revalidatePath("/notice");
      revalidatePath(`/notice/${id}`);
      revalidatePath("/");
      revalidatePath("/sitemap.xml");
    } catch (error) {
      console.error("[admin] 공지 삭제 실패", error);
      redirect("/admin?error=delete");
    }
  }
  redirect(formData.get("return") === "board" ? "/notice" : "/admin?deleted=1");
}

/* ── 에세이 ───────────────────────────────────────────── */
const ESSAY_TITLE_MAX = 100;
const ESSAY_SOURCE_MAX = 100;
const ESSAY_BODY_MAX = 30000;

/** 2026-10-17 → 2026.10.17 (달력에서 고른 값만 받아 줍니다) */
function toDotDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(`${y}-${m}-${d}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return `${y}.${m}.${d}`;
}

/** 에세이 새로 쓰기 / 수정 */
export async function saveEssayAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "로그인이 풀렸습니다. 다시 로그인해 주세요." };
  }
  if (storageMode() === "none") {
    return {
      error:
        "글을 저장할 곳(Blob 저장소)이 아직 연결되지 않았습니다. 담당자에게 문의해 주세요.",
    };
  }

  const id = String(formData.get("id") ?? "").trim() || undefined;
  const title = String(formData.get("title") ?? "").trim();
  const date = toDotDate(String(formData.get("date") ?? "").trim());
  const source = String(formData.get("source") ?? "").trim();
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim();

  if (!title) return { error: "제목을 적어 주세요." };
  if (title.length > ESSAY_TITLE_MAX) {
    return { error: `제목은 ${ESSAY_TITLE_MAX}자 이내로 적어 주세요.` };
  }
  if (!date) return { error: "날짜를 골라 주세요." };
  if (source.length > ESSAY_SOURCE_MAX) {
    return { error: `출처는 ${ESSAY_SOURCE_MAX}자 이내로 적어 주세요.` };
  }
  if (!body) return { error: "내용을 적어 주세요." };
  if (body.length > ESSAY_BODY_MAX) {
    return {
      error: `내용은 ${ESSAY_BODY_MAX.toLocaleString("ko-KR")}자 이내로 적어 주세요.`,
    };
  }

  let savedId = "";
  try {
    const saved = await saveEssayPost({
      id,
      title,
      date,
      source: source || null,
      body,
    });
    savedId = saved.id;
    revalidatePath("/essay");
    revalidatePath(`/essay/${saved.id}`);
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
  } catch (error) {
    console.error("[admin] 에세이 저장 실패", error);
    return { error: "저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요." };
  }

  redirect(
    formData.get("return") === "post"
      ? `/essay/${savedId}`
      : "/admin?tab=essay&saved=1",
  );
}

/** 에세이 삭제 */
export async function deleteEssayAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");

  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await removeEssayPost(id);
      revalidatePath("/essay");
      revalidatePath(`/essay/${id}`);
      revalidatePath("/");
      revalidatePath("/sitemap.xml");
    } catch (error) {
      console.error("[admin] 에세이 삭제 실패", error);
      redirect("/admin?tab=essay&error=delete");
    }
  }
  redirect(
    formData.get("return") === "board" ? "/essay" : "/admin?tab=essay&deleted=1",
  );
}
