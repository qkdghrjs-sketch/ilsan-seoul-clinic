import type { NoticeImage } from "@/lib/notice-images";

/**
 * 공지 본문 속 사진 자리 표시 (원장님 요청 2026-11-13: 블로그처럼 원하는 자리에 사진).
 *
 * - 글쓰기 화면에서 사진을 넣으면 커서가 있던 자리에 「[사진 1]」 한 줄이 들어갑니다.
 * - 공지 글에서는 그 줄 자리에 사진이 보입니다. 표시가 없는 사진은 글 맨 아래에 보입니다.
 * - 이 파일은 브라우저(글쓰기 미리 보기)에서도 쓰므로 서버 전용 기능을 불러오지 않습니다.
 */

/** 한 줄 전체가 [사진 1] 모양일 때만 사진 자리로 봅니다 */
export const PHOTO_MARK_RE = /^[ \t]*\[사진\s*(\d{1,2})\][ \t]*$/;

export const photoMark = (n: number) => `[사진 ${n}]`;

export type NoticeBlock =
  | { type: "text"; text: string }
  | { type: "image"; image: NoticeImage };

/** 본문을 글 덩어리와 사진으로 나눕니다 (빈 줄 = 문단 나눔) */
export function parseNoticeBody(body: string, images: NoticeImage[] = []): NoticeBlock[] {
  const byNumber = new Map<number, NoticeImage>();
  for (const image of images) {
    if (image.n && !byNumber.has(image.n)) byNumber.set(image.n, image);
  }
  const used = new Set<string>();
  const blocks: NoticeBlock[] = [];
  let lines: string[] = [];

  const flush = () => {
    for (const paragraph of lines.join("\n").split(/\n{2,}/)) {
      if (paragraph.trim()) blocks.push({ type: "text", text: paragraph });
    }
    lines = [];
  };

  for (const line of body.split("\n")) {
    const match = PHOTO_MARK_RE.exec(line);
    if (!match) {
      lines.push(line);
      continue;
    }
    // 표시 줄은 화면에 글자로 보이지 않습니다 (사진이 빠진 표시도 숨김)
    const image = byNumber.get(Number(match[1]));
    if (image && !used.has(image.url)) {
      flush();
      blocks.push({ type: "image", image });
      used.add(image.url);
    }
  }
  flush();

  // 표시가 없는 사진은 글 맨 아래에
  for (const image of images) {
    if (!used.has(image.url)) blocks.push({ type: "image", image });
  }
  return blocks;
}

/** 사진 자리 표시를 뺀 글자만 (검색 설명·첫 화면 미리보기용) */
export function noticePlainText(body: string) {
  return body
    .split("\n")
    .filter((line) => !PHOTO_MARK_RE.test(line))
    .join("\n");
}

/** 본문에서 그 번호의 사진 자리 표시 줄을 지웁니다 */
export function removePhotoMark(body: string, n: number) {
  return body
    .split("\n")
    .filter((line) => {
      const match = PHOTO_MARK_RE.exec(line);
      return !(match && Number(match[1]) === n);
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

/** 본문의 pos 자리에 사진 표시를 한 줄로 끼워 넣습니다 → 새 본문과 그다음 커서 자리 */
export function insertPhotoMark(body: string, pos: number | null, n: number) {
  const at = pos === null ? body.length : Math.max(0, Math.min(pos, body.length));
  const before = body.slice(0, at).replace(/\s+$/, "");
  const after = body.slice(at).replace(/^\s+/, "");
  const head = (before ? `${before}\n\n` : "") + photoMark(n);
  return { body: head + (after ? `\n\n${after}` : "\n"), cursor: head.length };
}
