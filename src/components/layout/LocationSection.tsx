import "./location.css";
import ClinicMap from "@/components/ClinicMap";
import { CLINIC } from "@/lib/site";
import { EXTERNAL } from "@/lib/nav";

/**
 * 오시는 길 · 진료시간 섹션.
 * 홈과 "찾아오시는 길" 페이지가 함께 씁니다.
 */
export default function LocationSection({
  title = `${CLINIC.shortName} 오시는 길`,
  eyebrow = "건강한 삶을 위해",
}: {
  title?: string;
  eyebrow?: string;
}) {
  return (
    <div id="eum_loc_box">
      <section className="eum_loc_inner">
        {/* 좌측: 진료시간 */}
        <div className="eum_loc_left">
          <div>
            <span className="eum_loc_subtitle">{eyebrow}</span>
            <h2 className="eum_loc_title">{title}</h2>
            <p className="eum_loc_desc">
              쉽게 찾고 편하게 오실 수 있도록 안내드립니다.
            </p>
          </div>

          <div className="eum_time_cat outpatient">
            <span className="eum_time_cat_dot" />
            진료시간
          </div>
          <ul className="eum_time_list">
            {CLINIC.outpatientRows.map((row) => (
              <li className="eum_time_row" key={row.label}>
                <span className="lbl">{row.label}</span>
                <span className="val">{row.value}</span>
              </li>
            ))}
          </ul>

          <div className="eum_time_cat transit">
            <span className="eum_time_cat_dot" />
            위치 안내
          </div>
          <ul className="eum_time_list">
            {CLINIC.transit.map((row) => (
              <li className="eum_time_row" key={row.label}>
                <span className="lbl">{row.label}</span>
                <span className="val">{row.text}</span>
              </li>
            ))}
          </ul>

          <ul className="eum_notice_list">
            {CLINIC.locationNotices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </div>

        {/* 우측: 지도 */}
        <div className="eum_loc_right">
          <h3 className="eum_addr_text">{CLINIC.address.full}</h3>
          <p className="eum_addr_sub">
            지하철 3호선 주엽역 인근 · 롯데마트 근처
          </p>

          <ClinicMap />

          <div className="eum_app_links">
            <div className="eum_app_item">
              <a href={EXTERNAL.naverMap} target="_blank" rel="noopener noreferrer">
                <span className="eum_icon eum_icon_n">N</span> 네이버 지도
              </a>
            </div>
            <div className="eum_app_item">
              <a href={EXTERNAL.kakaoMap} target="_blank" rel="noopener noreferrer">
                <span className="eum_icon eum_icon_k">K</span> 카카오 지도
              </a>
            </div>
            <div className="eum_app_item">
              <a href={EXTERNAL.tmap} target="_blank" rel="noopener noreferrer">
                <span className="eum_icon eum_icon_t">T</span> TMAP
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
