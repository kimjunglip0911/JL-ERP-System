/** 품목 조회 조건. */

import type { Item, ItemQuery } from "./types";

function matches(value: string, needle: string): boolean {
  const text = needle.trim().toLowerCase();
  if (!text) {
    return true;
  }
  return value.toLowerCase().includes(text);
}

/** 조회 버튼을 누른 조건으로 목록을 거른다. */
export function filterItems(items: Item[], query: ItemQuery): Item[] {
  return items.filter((item) => {
    if (!matches(item.code, query.code)) {
      return false;
    }
    if (!matches(item.name, query.name)) {
      return false;
    }
    if (!matches(item.spec, query.spec)) {
      return false;
    }
    if (query.asset && item.asset !== query.asset) {
      return false;
    }
    if (query.use && item.use !== query.use) {
      return false;
    }
    return true;
  });
}
