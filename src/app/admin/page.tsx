import type { Metadata } from "next";
import Link from "next/link";

import "./admin.css";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { formatNoticeDate, getNotices, storageMode } from "@/lib/notices";
import { getEssayPosts } from "@/lib/essay-posts";
import { ESSAYS } from "@/lib/essays";
import {
  deleteEssayAction,
  deleteNoticeAction,
  logout,
} from "./actions";
import { DeleteButton, EssayForm, LoginForm, NoticeForm } from "./forms";

/** 관리자 화면은 검색에 나오지 않게 합니다. */
export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false, nocache: true },
};

type SearchParams = Promise<{
  tab?: string;
  saved?: string;
  deleted?: string;
  error?: string;
  edit?: string;
  next?: string;
}>;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const configured = isAdminConfigured();
  const loggedIn = configured && (await isAdmin());

  /* ── 1. 로그인 전 ── */
  if (!loggedIn) {
    return (
      <div className="ad_wrap">
        <div className="ad_card narrow">
          <p className="ad_kicker">ADMIN</p>
          <h1 className="ad_title">관리자 로그인</h1>
          <p className="ad_desc">
            로그인하면 공지사항과 김금미 에세이에 「글쓰기」 단추가 생깁니다.
            원장님만 들어올 수 있습니다.
          </p>
          {configured ? (
            <LoginForm
              next={
                params.next?.startsWith("/") && !params.next.startsWith("//")
                  ? params.next
                  : undefined
              }
            />
          ) : (
            <p className="ad_error" role="alert">
              관리자 설정이 아직 끝나지 않았습니다. 담당자에게 문의해 주세요.
            </p>
          )}
          <p className="ad_back">
            <Link href="/">← 홈페이지로 돌아가기</Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── 2. 로그인 후 ── */
  const tab = params.tab === "essay" ? "essay" : "notice";
  const mode = storageMode();

  return (
    <div className="ad_wrap">
      <div className="ad_top">
        <div>
          <p className="ad_kicker">ADMIN</p>
          <h1 className="ad_title">
            {tab === "essay" ? "에세이 관리" : "공지사항 관리"}
          </h1>
        </div>
        <form action={logout}>
          <button type="submit" className="ad_btn">
            로그아웃
          </button>
        </form>
      </div>

      <nav className="ad_tabs" aria-label="관리 메뉴">
        <Link
          href="/admin"
          className={`ad_tab${tab === "notice" ? " on" : ""}`}
          aria-current={tab === "notice" ? "page" : undefined}
        >
          공지사항
        </Link>
        <Link
          href="/admin?tab=essay"
          className={`ad_tab${tab === "essay" ? " on" : ""}`}
          aria-current={tab === "essay" ? "page" : undefined}
        >
          에세이
        </Link>
      </nav>

      {mode === "none" && (
        <p className="ad_notice warn" role="alert">
          글을 저장할 곳(Blob 저장소)이 아직 연결되지 않아서 글을 올릴 수
          없습니다. 담당자에게 문의해 주세요.
        </p>
      )}
      {mode === "file" && (
        <p className="ad_notice">
          개발용 임시 저장 방식으로 동작 중입니다. (실제 홈페이지에는 반영되지
          않습니다)
        </p>
      )}
      {params.saved && <p className="ad_notice ok">저장했습니다.</p>}
      {params.deleted && <p className="ad_notice ok">삭제했습니다.</p>}
      {params.error && (
        <p className="ad_notice warn" role="alert">
          처리하지 못했습니다. 잠시 뒤 다시 시도해 주세요.
        </p>
      )}

      {tab === "notice" ? (
        <NoticePanel mode={mode} editId={params.edit} />
      ) : (
        <EssayPanel mode={mode} editId={params.edit} />
      )}
    </div>
  );
}

/* ── 공지사항 ── */
async function NoticePanel({
  mode,
  editId,
}: {
  mode: string;
  editId?: string;
}) {
  const notices = mode === "none" ? [] : await getNotices();
  const editing = editId
    ? notices.find((item) => item.id === editId)
    : undefined;

  return (
    <>
      <section className="ad_card">
        <h2 className="ad_h2">{editing ? "공지 수정" : "새 공지 쓰기"}</h2>
        <NoticeForm key={editing?.id ?? "new"} notice={editing} />
      </section>

      <section className="ad_card">
        <h2 className="ad_h2">
          올린 공지 <span className="ad_count">{notices.length}건</span>
        </h2>
        {notices.length === 0 ? (
          <p className="ad_empty">아직 올린 공지가 없습니다.</p>
        ) : (
          <ul className="ad_list">
            {notices.map((item) => (
              <li key={item.id} className="ad_item">
                <div className="ad_item_main">
                  <p className="ad_item_title">
                    {item.pinned && <span className="ad_pin">고정</span>}
                    {item.title}
                  </p>
                  <p className="ad_item_date">
                    {formatNoticeDate(item.createdAt)}
                    {item.updatedAt !== item.createdAt &&
                      ` · 수정 ${formatNoticeDate(item.updatedAt)}`}
                  </p>
                </div>
                <div className="ad_item_btns">
                  <Link href={`/notice/${item.id}`} className="ad_btn small">
                    보기
                  </Link>
                  <Link
                    href={`/admin?edit=${item.id}`}
                    className="ad_btn small"
                  >
                    수정
                  </Link>
                  <form action={deleteNoticeAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton message="이 공지를 삭제할까요? 삭제하면 되돌릴 수 없습니다." />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/* ── 에세이 ── */
async function EssayPanel({
  mode,
  editId,
}: {
  mode: string;
  editId?: string;
}) {
  const posts = mode === "none" ? [] : await getEssayPosts();
  const editing = editId ? posts.find((item) => item.id === editId) : undefined;

  return (
    <>
      <section className="ad_card">
        <h2 className="ad_h2">{editing ? "에세이 수정" : "새 에세이 쓰기"}</h2>
        <EssayForm
          key={editing?.id ?? "new"}
          essay={
            editing
              ? {
                  id: editing.id,
                  title: editing.title,
                  date: editing.date.replaceAll(".", "-"),
                  source: editing.source ?? "",
                  body: editing.body,
                }
              : undefined
          }
        />
      </section>

      <section className="ad_card">
        <h2 className="ad_h2">
          새로 올린 에세이 <span className="ad_count">{posts.length}편</span>
        </h2>
        {posts.length === 0 ? (
          <p className="ad_empty">아직 새로 올린 에세이가 없습니다.</p>
        ) : (
          <ul className="ad_list">
            {posts.map((item) => (
              <li key={item.id} className="ad_item">
                <div className="ad_item_main">
                  <p className="ad_item_title">{item.title}</p>
                  <p className="ad_item_date">
                    {item.date}
                    {item.source && ` · ${item.source}`}
                  </p>
                </div>
                <div className="ad_item_btns">
                  <Link href={`/essay/${item.id}`} className="ad_btn small">
                    보기
                  </Link>
                  <Link
                    href={`/admin?tab=essay&edit=${item.id}`}
                    className="ad_btn small"
                  >
                    수정
                  </Link>
                  <form action={deleteEssayAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton message="이 에세이를 삭제할까요? 삭제하면 되돌릴 수 없습니다." />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="ad_legacy">
          옛 홈페이지에서 옮겨 온 에세이 {ESSAYS.length}편은 그대로 보이며, 이
          화면에서는 고칠 수 없습니다.
        </p>
      </section>
    </>
  );
}
