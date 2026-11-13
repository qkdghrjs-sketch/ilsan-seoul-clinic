import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { storageMode } from "@/lib/store";
import {
  NOTICE_IMAGE_BYTES,
  looksLikeJpeg,
  saveNoticeImage,
} from "@/lib/notice-images";

export const dynamic = "force-dynamic";

/**
 * 공지사항 사진 올리기 — 로그인한 원장님(관리자)만.
 * 글쓰기 화면이 사진을 줄여 JPEG로 바꾼 뒤 한 장씩 보냅니다.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { ok: false, error: "로그인이 풀렸습니다. 다시 로그인해 주세요." },
      { status: 401 },
    );
  }
  if (storageMode() === "none") {
    return NextResponse.json(
      { ok: false, error: "사진을 저장할 곳이 아직 연결되지 않았습니다. 담당자에게 문의해 주세요." },
      { status: 503 },
    );
  }

  let file: FormDataEntryValue | null = null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    file = null;
  }
  if (!(file instanceof Blob)) {
    return NextResponse.json({ ok: false, error: "사진을 받지 못했습니다." }, { status: 400 });
  }
  if (file.size > NOTICE_IMAGE_BYTES) {
    return NextResponse.json({ ok: false, error: "사진이 너무 큽니다." }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!looksLikeJpeg(bytes)) {
    return NextResponse.json({ ok: false, error: "사진 파일만 올릴 수 있습니다." }, { status: 415 });
  }

  try {
    const url = await saveNoticeImage(bytes);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    console.error("[notice-image] 저장 실패", error);
    return NextResponse.json(
      { ok: false, error: "사진을 저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}
