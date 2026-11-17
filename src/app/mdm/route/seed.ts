/** 공정 화면의 빈 값과 샘플. */

import type { Route, RouteQuery, RouteStep, Wc, WcQuery } from "./types";

/** 빈 작업장. */
export function blankWc(): Wc {
  return { code: "", name: "", kind: "in", plant: "", hours: "", crew: "", machines: "0", use: "use" };
}

/** 공정 줄. */
export function blankStep(seq: number): RouteStep {
  return { seq, code: "", name: "", wc: "", setup: "", run: "", crew: "1", outside: false, inspect: false };
}

/** 빈 공정. */
export function blankRoute(): Route {
  return { parent: "", parentName: "", use: "use", note: "", steps: [] };
}

/** 작업장 조회 초기값. */
export function emptyWcQuery(): WcQuery {
  return { code: "", name: "", kind: "", use: "" };
}

/** 공정 조회 초기값. */
export function emptyRouteQuery(): RouteQuery {
  return { parent: "", parentName: "", use: "" };
}

function step(patch: Partial<RouteStep> & Pick<RouteStep, "seq" | "code" | "name" | "wc" | "run">): RouteStep {
  return { ...blankStep(patch.seq), ...patch };
}

/** 새로고침 때 되돌릴 작업장. */
export function seedWcs(): Wc[] {
  return [
    { code: "WC-CUT", name: "재단", kind: "in", plant: "본공장", hours: "8", crew: "4", machines: "2", use: "use" },
    { code: "WC-ASM", name: "조립", kind: "in", plant: "본공장", hours: "8", crew: "6", machines: "1", use: "use" },
    { code: "WC-PACK", name: "포장", kind: "in", plant: "본공장", hours: "8", crew: "3", machines: "1", use: "use" },
    { code: "WC-OUT", name: "외주인쇄", kind: "out", plant: "외주", hours: "8", crew: "1", machines: "0", use: "stop" },
  ];
}

/** 새로고침 때 되돌릴 공정. */
export function seedRoutes(): Route[] {
  return [
    {
      parent: "FG-BOX-01",
      parentName: "골판지 박스 A형",
      use: "use",
      note: "표준 공정",
      steps: [
        step({ seq: 1, code: "OP-10", name: "재단", wc: "WC-CUT", setup: "10", run: "5", crew: "2" }),
        step({ seq: 2, code: "OP-20", name: "조립", wc: "WC-ASM", setup: "5", run: "8", crew: "3" }),
        step({ seq: 3, code: "OP-30", name: "포장", wc: "WC-PACK", setup: "3", run: "4", crew: "2" }),
      ],
    },
    {
      parent: "SF-PAD-01",
      parentName: "완충 패드",
      use: "use",
      note: "반제품",
      steps: [step({ seq: 1, code: "OP-10", name: "재단", wc: "WC-CUT", setup: "5", run: "3", crew: "2" })],
    },
    {
      parent: "FG-PLT-01",
      parentName: "목재 팔레트",
      use: "stop",
      note: "단종",
      steps: [step({ seq: 1, code: "OP-10", name: "조립", wc: "WC-ASM", setup: "15", run: "20", crew: "2" })],
    },
  ];
}
