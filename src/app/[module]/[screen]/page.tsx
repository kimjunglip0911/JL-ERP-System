import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findScreen, listScreens } from "../../../menu/catalog";

type ScreenParams = { module: string; screen: string };

export const dynamicParams = false;

/** 카탈로그에 있는 화면만 정적 경로로 만든다. 전용 페이지가 있는 경로는 뺀다. */
export function generateStaticParams(): ScreenParams[] {
  const owned = new Set(["mdm/item", "mdm/bom"]);
  return listScreens().filter((entry) => !owned.has(`${entry.module}/${entry.screen}`));
}

/** 브라우저 제목은 항목명과 시스템명이다. */
export async function generateMetadata({
  params,
}: {
  params: Promise<ScreenParams>;
}): Promise<Metadata> {
  const { module: moduleSlug, screen } = await params;
  const hit = findScreen(moduleSlug, screen);
  if (!hit) {
    return { title: "JL ERP System" };
  }
  return { title: `${hit.item.title} · JL ERP System` };
}

/** 메뉴 항목의 제목과 설명만 보여 준다. */
export default async function ScreenPage({
  params,
}: {
  params: Promise<ScreenParams>;
}) {
  const { module: moduleSlug, screen } = await params;
  const hit = findScreen(moduleSlug, screen);
  if (!hit) {
    notFound();
  }
  return (
    <article className="screen">
      <p className="screen-group">{hit.group.title}</p>
      <h1 className="screen-title">{hit.item.title}</h1>
      <p className="screen-summary">{hit.item.summary}</p>
    </article>
  );
}
