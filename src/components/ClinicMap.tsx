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

type RoughmapNamespace = {
  /** 실제 지도를 그리는 클래스 — 아래 Lander 스크립트가 불러온 뒤에 생깁니다. */
  Lander?: new (options: {
    timestamp: string;
    key: string;
    mapWidth: string;
    mapHeight: string;
  }) => { render: () => void };
  /** 로더가 알려주는 배포 정보 (Lander 스크립트 주소를 만드는 데 씁니다) */
  phase?: string;
  cdn?: string;
  url_protocal?: string;
  url_cdn_domain?: string;
};

declare global {
  interface Window {
    daum?: { roughmap?: RoughmapNamespace };
  }
}

/** 스크립트 하나를 불러옵니다. (이미 있으면 그것을 기다립니다) */
function appendScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.charset = "UTF-8";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`load failed: ${src}`));
    document.head.appendChild(script);
  });
}

/** 조건이 만족될 때까지 짧은 간격으로 확인합니다. */
function waitFor(check: () => boolean, timeoutMs = 12000): Promise<boolean> {
  return new Promise((resolve) => {
    if (check()) {
      resolve(true);
      return;
    }
    const started = Date.now();
    const timer = setInterval(() => {
      if (check()) {
        clearInterval(timer);
        resolve(true);
      } else if (Date.now() - started > timeoutMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, 120);
  });
}

/**
 * 카카오 약도 스크립트를 준비합니다.
 *
 * 주의: 카카오가 주는 로더(roughmapLoader.js)는 실제 지도 스크립트를
 * `document.write` 로 불러옵니다. 그런데 document.write 는 페이지가 이미
 * 그려진 뒤에 호출되면 브라우저가 무시하기 때문에, 로더만 넣어서는
 * 지도가 영영 뜨지 않습니다.
 *
 * 그래서 로더가 window 에 남겨 준 배포 정보(phase·cdn·도메인)로
 * 실제 지도 스크립트 주소를 직접 만들어 불러옵니다.
 * 주소를 하드코딩하지 않으므로 카카오가 배포 번호를 바꿔도 따라갑니다.
 */
async function loadRoughmap(): Promise<boolean> {
  if (window.daum?.roughmap?.Lander) return true;

  await appendScript(LOADER_SRC);

  // 로더가 window.daum.roughmap 에 배포 정보를 채울 때까지 기다립니다.
  const ready = await waitFor(() => Boolean(window.daum?.roughmap?.cdn), 8000);
  if (!ready) return false;

  if (window.daum?.roughmap?.Lander) return true;

  const ns = window.daum!.roughmap!;
  const protocol = ns.url_protocal ?? "https:";
  const domain = ns.url_cdn_domain ?? "//t1.kakaocdn.net";
  const landerSrc = `${protocol}${domain}/kakaomapweb/roughmap/place/${ns.phase}/${ns.cdn}/roughmapLander.js`;

  await appendScript(landerSrc);
  return waitFor(() => Boolean(window.daum?.roughmap?.Lander), 12000);
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

    loadRoughmap()
      .then((ok) => {
        if (ok) render();
        /* 실패해도 아래 주소·지도앱 버튼은 그대로 보입니다. */
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
