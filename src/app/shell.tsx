import type { ReactNode } from "react";

/** 헤더, 본문, 풋. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="frame">
      <header className="header">
        <h1 className="brand">JL ERP System</h1>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p className="footer-note">JL ERP System</p>
        <p className="footer-note">개발 시작 2026년 11월 9일 · 사용 도구 Cursor · 100% AI만으로 개발</p>
      </footer>
    </div>
  );
}
