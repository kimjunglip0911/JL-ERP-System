/** 작업장과 공정 조회. */

import type { Route, RouteQuery, Wc, WcQuery } from "./types";

function matches(value: string, needle: string): boolean {
  const text = needle.trim().toLowerCase();
  if (!text) {
    return true;
  }
  return value.toLowerCase().includes(text);
}

/** 작업장 목록을 거른다. */
export function filterWcs(wcs: Wc[], query: WcQuery): Wc[] {
  return wcs.filter((wc) => {
    if (!matches(wc.code, query.code)) {
      return false;
    }
    if (!matches(wc.name, query.name)) {
      return false;
    }
    if (query.kind && wc.kind !== query.kind) {
      return false;
    }
    if (query.use && wc.use !== query.use) {
      return false;
    }
    return true;
  });
}

/** 공정 목록을 거른다. */
export function filterRoutes(routes: Route[], query: RouteQuery): Route[] {
  return routes.filter((route) => {
    if (!matches(route.parent, query.parent)) {
      return false;
    }
    if (!matches(route.parentName, query.parentName)) {
      return false;
    }
    if (query.use && route.use !== query.use) {
      return false;
    }
    return true;
  });
}
