/**
 * 구조화 데이터(JSON-LD) 삽입.
 *
 * 서버에서 렌더링되므로 HTML 소스에 그대로 남습니다.
 * 검색엔진과 AI 크롤러가 자바스크립트를 실행하지 않아도 읽을 수 있습니다.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 결과에서 </script> 가 조기 종료되지 않도록 이스케이프
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
