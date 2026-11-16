import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { SiteShell } from "./shell";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Malgun Gothic", "Apple SD Gothic Neo", "sans-serif"],
});

export const metadata: Metadata = {
  title: "JL ERP System",
  description: "JL ERP System",
};

/** 루트 레이아웃. 본문은 셸만 감싼다. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={geist.className}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
