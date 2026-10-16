import type { MetadataRoute } from "next";
import { NAV } from "@/lib/nav";
import { getAllEssays } from "@/lib/essay-posts";
import { getNotices } from "@/lib/notices";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

/** 새 공지가 사이트맵에도 반영되도록 1시간마다 새로 만듭니다 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date(CONTENT_UPDATED);

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  /* 메뉴에 등록된 모든 페이지 */
  const seen = new Set<string>();
  for (const group of NAV) {
    for (const child of group.children) {
      if (seen.has(child.href)) continue;
      seen.add(child.href);

      entries.push({
        url: `${SITE_URL}${child.href}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  /* 공지 글은 올릴 때마다 생기므로 사이트맵에도 하나씩 넣습니다 */
  for (const notice of await getNotices()) {
    entries.push({
      url: `${SITE_URL}/notice/${notice.id}`,
      lastModified: new Date(notice.updatedAt),
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

  /* 에세이 글은 메뉴에 따로 없으므로 하나씩 추가합니다 */
  for (const essay of await getAllEssays()) {
    entries.push({
      url: `${SITE_URL}/essay/${essay.id}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  return entries;
}
