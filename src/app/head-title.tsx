"use client";

import { usePathname } from "next/navigation";
import { findScreen } from "../menu/catalog";

/** 열린 하위 메뉴 이름을 헤더 가운데에 둔다. */
export function HeadTitle() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 2) {
    return null;
  }
  const [moduleSlug, screenSlug] = parts;
  const hit = findScreen(moduleSlug, screenSlug);
  if (!hit) {
    return null;
  }
  return <p className="head-title">{hit.item.title}</p>;
}
