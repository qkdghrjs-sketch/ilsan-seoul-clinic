import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SubPageHeader from "@/components/layout/SubPageHeader";
import { SubPage, Section } from "@/components/subpage/parts";
import BlogEditor from "@/app/admin/editor";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { getEssayPosts } from "@/lib/essay-posts";

export const metadata: Metadata = {
  title: "에세이 쓰기",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * 에세이 글쓰기 · 수정 (관리자만) — ?edit=글번호 면 수정
 * 옛 홈페이지에서 옮겨 온 8편은 원문 보존을 위해 고칠 수 없습니다.
 */
export default async function EssayWritePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const here = edit ? `/essay/write?edit=${encodeURIComponent(edit)}` : "/essay/write";
  if (!(isAdminConfigured() && (await isAdmin()))) {
    redirect(`/admin?next=${encodeURIComponent(here)}`);
  }

  const post = edit
    ? (await getEssayPosts()).find((item) => item.id === edit)
    : undefined;

  return (
    <>
      <SubPageHeader
        currentPath="/essay/write"
        parentPath="/essay"
        title={post ? "에세이 수정" : "에세이 쓰기"}
      />
      <SubPage>
        <Section narrow>
          <BlogEditor
            kind="essay"
            cancelHref={post ? `/essay/${post.id}` : "/essay"}
            initial={
              post
                ? {
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    date: post.date.replaceAll(".", "-"),
                    source: post.source ?? "",
                  }
                : undefined
            }
          />
        </Section>
      </SubPage>
    </>
  );
}
