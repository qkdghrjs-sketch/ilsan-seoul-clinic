import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import { SubPage, Section } from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { formatNoticeDate, getNotice } from "@/lib/notices";

type Params = { params: Promise<{ id: string }> };

/** 공지는 올릴 때마다 생기므로 미리 만들어 두지 않고, 처음 열 때 만들어 1분간 보관합니다. */
export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) return { robots: { index: false } };
  const description = notice.body.replace(/\s+/g, " ").slice(0, 120);
  const path = `/notice/${notice.id}`;

  return {
    title: notice.title,
    description,
    alternates: { canonical: path },
    openGraph: { title: notice.title, description, url: path, type: "article" },
  };
}

export default async function NoticePage({ params }: Params) {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) notFound();

  const path = `/notice/${notice.id}`;
  const description = notice.body.replace(/\s+/g, " ").slice(0, 120);
  const paragraphs = notice.body.split(/\n{2,}/);

  return (
    <>
      <JsonLd
        data={pageSchemas({
          path,
          name: notice.title,
          description,
          breadcrumb: [
            { name: "공지사항", url: "/notice" },
            { name: notice.title, url: path },
          ],
        })}
      />
      <SubPageHeader
        currentPath={path}
        parentPath="/notice"
        title={notice.title}
      />

      <SubPage>
        <Section narrow>
          <article className="es_article">
            <div className="eum_rv d1 es_meta">
              <span>{formatNoticeDate(notice.createdAt)}</span>
              <span>{CLINIC.shortName}</span>
              {notice.updatedAt !== notice.createdAt && (
                <span>수정 {formatNoticeDate(notice.updatedAt)}</span>
              )}
            </div>

            {/* 글은 그대로 보여 주고(줄바꿈 유지), 어떤 코드도 실행하지 않습니다 */}
            <div className="eum_rv d2 es_body no_body">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>

          <div
            className="eum_rv d2"
            style={{ textAlign: "center", marginTop: 40 }}
          >
            <Link href="/notice" className="sp_pill lg">
              공지 목록으로 →
            </Link>
          </div>
        </Section>

      </SubPage>
    </>
  );
}
