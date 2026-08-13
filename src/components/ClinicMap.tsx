"use client";

import { useEffect, useRef } from "react";

import { CLINIC, KAKAO_ROUGHMAP } from "@/lib/site";

/**
 * 병원 위치 지도.
 *
 * 1) src/lib/site.ts 의 KAKAO_ROUGHMAP 에 timestamp·key 를 넣으면
 *    카카오맵 "지도 퍼가기" 약도가 그대로 표시됩니다.
 * 2) 값이 비어 있으면 주소 기반 지도를 대신 보여 주므로
 *    지도 자리가 비어 보이는 일은 없습니다.
 *
 * ※ 카카오 약도 로더 스크립트는 `daumRoughmapContainer{timestamp}` 라는 id를
 *   직접 찾아가므로 컨테이너 id는 임의로 바꿀 수 없습니다.
 */

const LOADER_SRC = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";

declare global {
  interface Window {
    daum?: {
      roughmap?: {
        Lander: new (options: {
          timestamp: string;
          key: string;
          mapWidth: string;
          mapHeight: string;
        }) => { render: () => void };
      };
    };
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.daum?.roughmap?.Lander) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LOADER_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      if (window.daum?.roughmap?.Lander) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = LOADER_SRC;
    script.charset = "UTF-8";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

function KakaoRoughMap({ timestamp, mapKey }: { timestamp: string; mapKey: string }) {
  const rendered = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const render = () => {
      if (cancelled || rendered.current) return;
      const container = document.getElementById(
        `daumRoughmapContainer${timestamp}`,
      );
      const Lander = window.daum?.roughmap?.Lander;
      if (!container || !Lander) return;

      container.innerHTML = "";
      try {
        new Lander({
          timestamp,
          key: mapKey,
          mapWidth: "100%",
          mapHeight: "100%",
        }).render();
        rendered.current = true;
        // 약도가 컨테이너 크기를 다시 계산하도록 신호를 보냅니다.
        setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
        setTimeout(() => window.dispatchEvent(new Event("resize")), 1200);
      } catch {
        /* 지도 표시 실패는 페이지 전체에 영향을 주지 않습니다. */
      }
    };

    loadScript()
      .then(() => {
        setTimeout(render, 200);
        setTimeout(render, 800);
      })
      .catch(() => {
        /* 스크립트 로드 실패 시 지도 영역은 빈 상태로 남습니다. */
      });

    return () => {
      cancelled = true;
    };
  }, [timestamp, mapKey]);

  return (
    <div
      id={`daumRoughmapContainer${timestamp}`}
      className="root_daum_roughmap root_daum_roughmap_landing"
    />
  );
}

export default function ClinicMap() {
  const { timestamp, key } = KAKAO_ROUGHMAP;
  const hasKakao = Boolean(timestamp && key);

  return (
    <div className="eum_map_wrap">
      <div className="eum_map_inner">
        {hasKakao ? (
          <KakaoRoughMap timestamp={timestamp} mapKey={key} />
        ) : (
          <iframe
            title={`${CLINIC.name} 위치 지도`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              CLINIC.address.building,
            )}&hl=ko&z=17&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="eum_map_frame"
          />
        )}
      </div>
    </div>
  );
}
