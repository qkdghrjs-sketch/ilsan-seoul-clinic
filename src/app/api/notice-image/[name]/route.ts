import { isImageName, readNoticeImage } from "@/lib/notice-images";

export const dynamic = "force-dynamic";

/** 공지사항 사진 보여 주기 — 이름이 바뀌지 않으므로 브라우저가 오래 기억해도 됩니다 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!isImageName(name)) return new Response("Not found", { status: 404 });

  const bytes = await readNoticeImage(name);
  if (!bytes) return new Response("Not found", { status: 404 });

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
