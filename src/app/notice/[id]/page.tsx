import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import { SubPage, Section } from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { formatNoticeDate, getNotice } from "@/lib/notices";
import { AdminPostTools } from "@/components/subpage/AdminBar";
import { deleteNoticeAction } from "@/app/admin/actions";
import { noticePlainText, parseNoticeBody } from "@/lib/notice-body";
import "@/components/subpage/photos.css";

type Params = { params: Promise<{ id: string }> };

/**
 * 공지 화면은 열 때마다 새로 만듭니다.
 * 아래 「수정·삭제」가 관리자 로그인(쿠키)을 확인하므로 미리 만들어 둘 수 없습니다.
 * (2026-10-28 원장님이 올린 공지가 「보관」 방식 때문에 서버 오류로 안 열렸던 것을 고침)
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) return { robots: { index: false } };
  const description = noticePlainText(notice.body).replace(/\s+/g, " ").trim().slice(0, 120);
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
  const description = noticePlainText(notice.body).replace(/\s+/g, " ").trim().slice(0, 120);
  const blocks = parseNoticeBody(notice.body, notice.images ?? []);

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
              {/* 사진은 원장님이 글쓰기에서 정한 자리(「[사진 1]」 줄)에 보입니다. 누르면 크게 열립니다 */}
              {blocks.map((block, index) =>
                block.type === "text" ? (
                  <p key={index}>{block.text}</p>
                ) : (
                  <a
                    key={index}
                    href={block.image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="np_photo"
                    aria-label="사진 크게 보기"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.image.url}
                      alt={`${notice.title} 사진`}
                      width={block.image.w}
                      height={block.image.h}
                      loading="lazy"
                    />
                  </a>
                ),
              )}
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

          <AdminPostTools
            editHref={`/notice/write?edit=${notice.id}`}
            deleteAction={deleteNoticeAction}
            id={notice.id}
            confirmMessage="이 공지를 삭제할까요? 삭제하면 되돌릴 수 없습니다."
          />
        </Section>
      </SubPage>
    </>
  );
}
