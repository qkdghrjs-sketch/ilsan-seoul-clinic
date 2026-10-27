import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import { SubPage, Section } from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { DOCTOR_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { ESSAYS } from "@/lib/essays";
import { findEssayAny, getAllEssays } from "@/lib/essay-posts";

type Params = { params: Promise<{ id: string }> };

/**
 * 옛 글(1~8)은 미리 만들어 두고, 원장님이 새로 올린 글은 처음 열 때 만들어
 * 1분간 보관합니다. (글을 고치거나 지우면 바로 반영됩니다)
 */
export const revalidate = 60;

export function generateStaticParams() {
  return ESSAYS.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const essay = await findEssayAny(id);
  if (!essay) return { robots: { index: false } };
  const path = `/essay/${essay.id}`;

  return {
    title: essay.title,
    description: essay.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: essay.title,
      description: essay.excerpt,
      url: path,
      type: "article",
    },
  };
}

/** 2014.06.25 → 2014-06-25 */
const toIso = (date: string) => date.replaceAll(".", "-");

export default async function EssayPage({ params }: Params) {
  const { id } = await params;
  const essay = await findEssayAny(id);
  if (!essay) notFound();

  const all = await getAllEssays();
  const path = `/essay/${essay.id}`;
  const index = all.findIndex((item) => item.id === essay.id);
  /* 목록은 최신순이므로, 다음 글은 더 오래된 글입니다. */
  const newer = index > 0 ? all[index - 1] : null;
  const older = index < all.length - 1 ? all[index + 1] : null;

  return (
    <>
      <JsonLd
        data={[
          ...pageSchemas({
            path,
            name: essay.title,
            description: essay.excerpt,
            breadcrumb: [
              { name: "김금미 에세이", url: "/essay" },
              { name: essay.title, url: path },
            ],
          }),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: essay.title,
            datePublished: toIso(essay.date),
            inLanguage: "ko-KR",
            author: { "@id": DOCTOR_ID },
            publisher: { "@id": `${SITE_URL}/#clinic` },
            mainEntityOfPage: `${SITE_URL}${path}`,
          },
        ]}
      />
      <SubPageHeader
        currentPath={path}
        parentPath="/essay"
        title={essay.title}
      />

      <SubPage>
        <Section narrow>
          <article className="es_article">
            <div className="eum_rv d1 es_meta">
              <span>{essay.date}</span>
              <span>김금미 원장</span>
              {essay.source && <span>{essay.source}</span>}
            </div>

            <div className="eum_rv d2 es_body">
              {essay.blocks.map((block, blockIndex) =>
                block.type === "p" ? (
                  <p key={blockIndex}>{block.text}</p>
                ) : (
                  <figure className="es_photo" key={blockIndex}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.src} alt={block.alt} loading="lazy" />
                  </figure>
                ),
              )}
            </div>

            {essay.sourceUrl && (
              <p className="es_source_link">
                <a href={essay.sourceUrl} target="_blank" rel="noopener noreferrer">
                  신문사 원문 보기 →
                </a>
              </p>
            )}
          </article>

          <nav className="es_pager" aria-label="다른 에세이">
            {newer ? (
              <Link href={`/essay/${newer.id}`} className="es_pager_item">
                <span>다음 글</span>
                <strong>{newer.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {older ? (
              <Link href={`/essay/${older.id}`} className="es_pager_item right">
                <span>이전 글</span>
                <strong>{older.title}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <div className="eum_rv d2" style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/essay" className="sp_pill lg">
              에세이 목록으로 →
            </Link>
          </div>
        </Section>

      </SubPage>
    </>
  );
}
