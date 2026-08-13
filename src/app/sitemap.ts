import type { MetadataRoute } from "next";
import { NAV } from "@/lib/nav";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return entries;
}
