import type { NextConfig } from "next";

/**
 * 옛 홈페이지(iseoulmed.com, M서클 ASP) 주소 → 새 페이지 (2026-11-02)
 * 2026-11-08 밤 iseoulmed.com 을 이 사이트로 옮긴 뒤에도 네이버·즐겨찾기에 남은 옛 링크가 열리도록.
 * 옛 메뉴 목록은 옛 사이트 /sitemenu/menu.js 기준.
 */
const OLD_PAGES: Array<[string, string]> = [
  ["/intro/doctor.asp", "/doctor"],
  ["/intro/doctor01.asp", "/doctor"],
  ["/intro/guide.asp", "/location"],
  ["/intro/est.asp", "/tour"],
  ["/intro/map.asp", "/location"],
  ["/intro/sitemap.asp", "/"],
  ["/notice/:page(notice_.*\\.asp)", "/notice"],
  ["/clinic01/clinic01_01.asp", "/endoscopy"],
  ["/clinic01/clinic01_02.asp", "/endoscopy/faq"],
  ["/clinic01/:page(.*\\.asp)", "/endoscopy"],
  ["/nt_report/:page(.*\\.asp)", "/endoscopy"],
  ["/clinic02/clinic02_01.asp", "/checkup/hypertension"],
  ["/clinic02/clinic02_02.asp", "/checkup/diabetes"],
  ["/clinic02/clinic02_03.asp", "/checkup/hepatitis-b"],
  ["/clinic02/clinic02_04.asp", "/checkup/nhis"],
  ["/clinic02/clinic02_05.asp", "/checkup/premium"],
  ["/clinic02/:page(.*\\.asp)", "/checkup"],
  ["/board/board_list.asp", "/essay"],
  ["/news/:page(.*\\.asp)", "/essay"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 에세이 글: board_view.asp?srno=5 → /essay/5 (옛 글 번호 = 새 글 번호)
      {
        source: "/board/board_view.asp",
        has: [{ type: "query", key: "srno", value: "(?<srno>\\d+)" }],
        destination: "/essay/:srno",
        permanent: true,
      },
      { source: "/board/:page(.*\\.asp)", destination: "/essay", permanent: true },
      ...OLD_PAGES.map(([source, destination]) => ({ source, destination, permanent: true })),
      // 그 밖의 옛 .asp 주소(첫 화면·로그인·회원 등)는 첫 화면으로
      { source: "/:path(.*\\.asp)", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
