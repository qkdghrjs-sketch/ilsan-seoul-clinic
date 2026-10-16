import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import { SubPage, Section, SubCta } from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { DOCTOR_ID } from "@/lib/schema";
import { CLINIC, SITE_URL } from "@/lib/site";
import { ESSAYS, findEssay } from "@/lib/essays";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ESSAYS.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const essay = findEssay(id);
  if (!essay) return {};
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
  const essay = findEssay(id);
  if (!essay) notFound();

  const path = `/essay/${essay.id}`;
  const index = ESSAYS.findIndex((item) => item.id === essay.id);
  /* 목록은 최신순이므로, 다음 글은 더 오래된 글입니다. */
  const newer = index > 0 ? ESSAYS[index - 1] : null;
  const older = index < ESSAYS.length - 1 ? ESSAYS[index + 1] : null;

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

        <SubCta
          title={
            <>
              진료와 검사 예약은
              <br />
              전화로 해 주세요
            </>
          }
          sub="충분히 듣고, 정확히 검사하고, 끝까지 함께 보는 진료를 합니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="찾아오시는 길 →"
          secondaryHref="/location"
        />
      </SubPage>
    </>
  );
}
