# 일산서울내과의원 홈페이지

경기도 고양시 일산서구 주엽동 **일산서울내과의원** 공식 홈페이지입니다.
Next.js(App Router)로 만든 정적 사이트이며, 게시판·관리자 화면 없이 안내 페이지만으로 구성되어 있습니다.

---

## 1. 내용을 고치고 싶을 때 (자주 쓰는 파일)

코드를 몰라도 아래 파일의 **글자만** 바꾸면 사이트 전체에 반영됩니다.

| 무엇을 바꾸나 | 파일 |
|---|---|
| 병원 이름 · 주소 · 전화번호 · **진료시간** | `src/lib/site.ts` |
| 원장님 약력 · 수상 | `src/lib/doctor.ts` |
| 수면 위 내시경 설명 · FAQ 10문항 | `src/lib/endoscopy.ts` |
| 검사안내 (고혈압/당뇨/B형간염/공단검진/정밀종합) | `src/lib/checkups.ts` |
| 메뉴 구성 | `src/lib/nav.ts` |
| 자주 묻는 질문 요약 (AI·검색용) | `src/lib/core-answers.ts` |
| 개인정보처리방침 · 이용약관 | `src/lib/policies.ts` |

> **진료시간을 바꿨다면** `src/lib/site.ts` 의 `CONTENT_UPDATED` 날짜도 오늘 날짜로 바꿔 주세요.
> 검색엔진과 AI가 "언제 확인된 정보인지" 보고 인용 여부를 정합니다.

---

## 2. 지도 (카카오맵 약도 넣기)

지금은 주소 기반 지도가 표시됩니다. 카카오맵 약도로 바꾸려면:

1. `map.kakao.com` 에서 **일산서울내과의원** 검색
2. 장소를 누른 뒤 **[지도 퍼가기]** → **[지도 API]** 탭 선택
3. 나오는 코드 안에서 `timestamp` 와 `key` 값을 찾습니다
4. `src/lib/site.ts` 의 `KAKAO_ROUGHMAP` 에 두 값을 넣고 저장

값을 비워 두면 지금처럼 주소 기반 지도가 계속 표시됩니다.

---

## 3. 페이지 구성

```
/                     홈
/doctor               원장님 소개
/location             찾아오시는 길 (진료시간 · 지도)
/endoscopy            수면 위 내시경이란?
/endoscopy/faq        수면 위 내시경 FAQ
/checkup              검사안내 전체보기
/checkup/hypertension 고혈압 정기검사
/checkup/diabetes     당뇨병 정기검사
/checkup/hepatitis-b  B형간염 정기검사
/checkup/nhis         국민공단검진
/checkup/premium      정밀종합검사
```

검색엔진·AI용 파일: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`

---

## 4. 개발 · 배포

```bash
npm install      # 처음 한 번
npm run dev      # http://localhost:3000 에서 미리보기
npm run build    # 배포용 빌드 검사
```

배포는 Vercel을 사용합니다. **새 프로젝트로 연결**해야 합니다
(이 폴더는 이움내과 홈페이지 코드를 복사해 만든 것이라, 기존 프로젝트에 그대로
올리면 다른 병원 사이트를 덮어씁니다).

배포 후 Vercel 환경변수에 아래를 넣으면 좋습니다.

| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 실제 주소 (예: `https://ilsanseoul.vercel.app`) |
| `GOOGLE_SITE_VERIFICATION` | 구글 서치콘솔 인증 코드 (선택) |
| `NAVER_SITE_VERIFICATION` | 네이버 웹마스터 인증 코드 (선택) |

---

## 5. 콘텐츠 작성 시 주의

- 의료광고법상 최상급 표현("최고", "1등", "유일"), 치료효과 보장, 환자 체험담 강조는 금지입니다.
- 원장 약력·진료시간은 병원에서 확인된 내용만 사용하고, 임의로 만들어 넣지 않습니다.
- "30년 진료 경력"은 1989년 의과대학 졸업 기준의 사실 표현이라 사용 가능합니다.
