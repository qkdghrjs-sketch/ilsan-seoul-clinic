import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SubPageHeader from "@/components/layout/SubPageHeader";
import { SubPage, Section } from "@/components/subpage/parts";
import BlogEditor from "@/app/admin/editor";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { getNotice } from "@/lib/notices";

export const metadata: Metadata = {
  title: "공지 쓰기",
  robots: { index: false, follow: false, nocache: true },
};

/** 공지 글쓰기 · 수정 (관리자만) — ?edit=글번호 면 수정 */
export default async function NoticeWritePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const here = edit ? `/notice/write?edit=${encodeURIComponent(edit)}` : "/notice/write";
  if (!(isAdminConfigured() && (await isAdmin()))) {
    redirect(`/admin?next=${encodeURIComponent(here)}`);
  }

  const notice = edit ? await getNotice(edit) : null;

  return (
    <>
      <SubPageHeader
        currentPath="/notice/write"
        parentPath="/notice"
        title={notice ? "공지 수정" : "공지 쓰기"}
      />
      <SubPage>
        <Section narrow>
          <BlogEditor
            kind="notice"
            cancelHref={notice ? `/notice/${notice.id}` : "/notice"}
            initial={
              notice
                ? {
                    id: notice.id,
                    title: notice.title,
                    body: notice.body,
                    pinned: notice.pinned,
                  }
                : undefined
            }
          />
        </Section>
      </SubPage>
    </>
  );
}
