"use client";

import { useEffect, useRef } from "react";

/**
 * 스크롤 등장 애니메이션.
 *
 * 자식 요소 중 지정한 클래스(기본 .eum_rv)를 가진 것들을 관찰하다가
 * 화면에 들어오면 활성 클래스(기본 .on)를 붙입니다.
 *
 * 원본 아임웹 코드의 IntersectionObserver 로직과 동일하게 동작하되,
 * 페이지마다 스크립트를 반복하지 않도록 공용으로 뺐습니다.
 */
export default function Reveal({
  children,
  selector = ".eum_rv",
  activeClass = "on",
  threshold = 0.08,
  rootMargin = "0px 0px -30px 0px",
  className,
  once = true,
}: {
  children: React.ReactNode;
  selector?: string;
  activeClass?: string;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const targets = Array.from(scope.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    // 모션 최소화를 선호하는 사용자에게는 애니메이션 없이 즉시 표시합니다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add(activeClass));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(activeClass);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove(activeClass);
          }
        });
      },
      { threshold, rootMargin },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [selector, activeClass, threshold, rootMargin, once]);

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
