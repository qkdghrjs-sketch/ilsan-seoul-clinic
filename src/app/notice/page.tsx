import type { Metadata } from "next";
import Link from "next/link";

import SubPageHeader from "@/components/layout/SubPageHeader";
import JsonLd from "@/components/JsonLd";
import {
  SubPage,
  SubHero,
  HeroInfoCard,
  Section,
  SectionHeader,
  SubCta,
} from "@/components/subpage/parts";
import { pageSchemas } from "@/lib/page-schema";
import { CLINIC } from "@/lib/site";
import { formatNoticeDate, getNotices } from "@/lib/notices";

const PATH = "/notice";
const TITLE = "공지사항";
const DESCRIPTION =
  "일산서울내과의원 공지사항. 휴진 안내와 진료 관련 소식을 알려 드립니다.";

/** 원장님이 새 공지를 올리면 바로 반영되고, 아니어도 1분 안에 갱신됩니다. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
};

export default async function NoticeIndexPage() {
  const notices = await getNotices();

  return (
    <>
      <JsonLd
        data={pageSchemas({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [{ name: TITLE, url: PATH }],
        })}
      />
      <SubPageHeader currentPath={PATH} />

      <SubPage>
        <SubHero
          eyebrow="NOTICE · 공지사항"
          title={
            <>
              진료 소식을
              <br />
              <em>알려 드립니다</em>
            </>
          }
          sub="휴진 안내와 진료 관련 소식을 이곳에서 확인하실 수 있습니다."
          cards={
            <>
              <HeroInfoCard icon="clock" label="진료시간" delay="d2">
                {CLINIC.outpatientRows[0].value}
              </HeroInfoCard>
              <HeroInfoCard icon="phone" label="상담·예약" teal delay="d3">
                {CLINIC.telephoneDisplay}
              </HeroInfoCard>
            </>
          }
        />

        <Section tightTop>
          <SectionHeader eyebrow="LIST" title="공지 목록" />

          {notices.length === 0 ? (
            <p className="eum_rv d2 es_empty">등록된 공지가 없습니다.</p>
          ) : (
            <ul className="es_list">
              {notices.map((item, index) => (
                <li
                  key={item.id}
                  className={`eum_rv d${Math.min(index + 1, 5)}`}
                >
                  <Link href={`${PATH}/${item.id}`} className="es_item">
                    <span className="es_item_date">
                      {formatNoticeDate(item.createdAt)}
                    </span>
                    <span className="es_item_body">
                      <strong className="es_item_title">
                        {item.pinned && <b className="no_pin">중요 </b>}
                        {item.title}
                      </strong>
                      <span className="es_item_excerpt">
                        {item.body.replace(/\s+/g, " ").slice(0, 80)}
                        {item.body.length > 80 ? "…" : ""}
                      </span>
                    </span>
                    <span className="es_item_arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <SubCta
          title={
            <>
              진료와 검사 예약은
              <br />
              전화로 해 주세요
            </>
          }
          sub="진료시간은 사정에 따라 바뀔 수 있어 방문 전 전화로 확인하시면 좋습니다."
          note={`${CLINIC.name} · ${CLINIC.address.full}`}
          secondaryLabel="찾아오시는 길 →"
          secondaryHref="/location"
        />
      </SubPage>
    </>
  );
}
