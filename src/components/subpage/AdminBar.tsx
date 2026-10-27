import Link from "next/link";

import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { logout } from "@/app/admin/actions";
import { DeleteButton as ConfirmDelete } from "@/app/admin/forms";

/**
 * 게시판 아래 관리자 줄 (공지사항 · 김금미 에세이)
 *  · 로그인 전: 「관리자 로그인」 작은 단추
 *  · 로그인 후: 「글쓰기」 + 「로그아웃」
 */
export default async function AdminBar({
  writeHref,
  returnPath,
}: {
  writeHref: string;
  /** 로그인·로그아웃 뒤 돌아올 주소 */
  returnPath: string;
}) {
  const loggedIn = isAdminConfigured() && (await isAdmin());

  if (!loggedIn) {
    return (
      <div className="ab_bar">
        <Link
          href={`/admin?next=${encodeURIComponent(returnPath)}`}
          className="ab_login"
          rel="nofollow"
        >
          관리자 로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="ab_bar on">
      <span className="ab_state">관리자로 로그인되어 있습니다</span>
      <form action={logout}>
        <input type="hidden" name="next" value={returnPath} />
        <button type="submit" className="ab_btn">
          로그아웃
        </button>
      </form>
      <Link href={writeHref} className="ab_btn primary">
        ✎ 글쓰기
      </Link>
    </div>
  );
}

/** 글 화면 아래 「수정 · 삭제」 (관리자에게만 보임) */
export async function AdminPostTools({
  editHref,
  deleteAction,
  id,
  confirmMessage,
}: {
  editHref: string;
  deleteAction: (formData: FormData) => Promise<void>;
  id: string;
  confirmMessage: string;
}) {
  if (!(isAdminConfigured() && (await isAdmin()))) return null;

  return (
    <div className="ab_bar on">
      <Link href={editHref} className="ab_btn">
        수정
      </Link>
      <form action={deleteAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="return" value="board" />
        <ConfirmDelete message={confirmMessage} />
      </form>
    </div>
  );
}
