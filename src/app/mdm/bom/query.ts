/** BOM 조회 조건. */

import type { Bom, BomQuery } from "./types";

function matches(value: string, needle: string): boolean {
  const text = needle.trim().toLowerCase();
  if (!text) {
    return true;
  }
  return value.toLowerCase().includes(text);
}

/** 조회 버튼을 누른 조건으로 BOM 헤더를 거른다. */
export function filterBoms(boms: Bom[], query: BomQuery): Bom[] {
  return boms.filter((bom) => {
    if (!matches(bom.parent, query.parent)) {
      return false;
    }
    if (!matches(bom.parentName, query.parentName)) {
      return false;
    }
    if (query.kind && bom.kind !== query.kind) {
      return false;
    }
    if (query.use && bom.use !== query.use) {
      return false;
    }
    return true;
  });
}
