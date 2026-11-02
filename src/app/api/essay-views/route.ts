import { NextResponse } from "next/server";

import { findEssayAny } from "@/lib/essay-posts";
import { addEssayView } from "@/lib/views";

export const dynamic = "force-dynamic";

/** 에세이 글 화면이 열리면 조회수 1 증가 (화면 쪽 EssayViewCounter 가 하루 한 번만 부름) */
export async function POST(request: Request) {
  let id = "";
  try {
    const body = (await request.json()) as { id?: unknown };
    id = String(body.id ?? "").slice(0, 80);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!id || !(await findEssayAny(id))) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  try {
    const views = await addEssayView(id);
    return NextResponse.json({ ok: true, views });
  } catch (error) {
    console.error("[essay-views] 저장 실패", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
