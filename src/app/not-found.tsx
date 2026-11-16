import Link from "next/link";

/** 카탈로그에 없는 주소. */
export default function NotFound() {
  return (
    <article className="screen">
      <h1 className="screen-title">페이지를 찾을 수 없습니다</h1>
      <p className="screen-summary">
        <Link href="/">처음 화면</Link>
      </p>
    </article>
  );
}
