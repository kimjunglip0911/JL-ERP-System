/** 작업장과 품목 공정. */

export type WcKind = "in" | "out";
export type UseKind = "use" | "stop";

export type Wc = {
  code: string;
  name: string;
  kind: WcKind;
  plant: string;
  hours: string;
  crew: string;
  machines: string;
  use: UseKind;
};

export type WcQuery = {
  code: string;
  name: string;
  kind: WcKind | "";
  use: UseKind | "";
};

export type RouteStep = {
  seq: number;
  code: string;
  name: string;
  wc: string;
  setup: string;
  run: string;
  crew: string;
  outside: boolean;
  inspect: boolean;
};

export type Route = {
  parent: string;
  parentName: string;
  use: UseKind;
  note: string;
  steps: RouteStep[];
};

export type RouteQuery = {
  parent: string;
  parentName: string;
  use: UseKind | "";
};

/** 작업장 키. */
export function wcKey(wc: Pick<Wc, "code">): string {
  return wc.code.trim();
}

/** 공정 키. */
export function routeKey(route: Pick<Route, "parent">): string {
  return route.parent.trim();
}

/** 일가동시간과 가동인원의 곱. */
export function capHours(wc: Pick<Wc, "hours" | "crew">): string {
  const hours = wc.hours.trim();
  const crew = wc.crew.trim();
  if (!/^\d+(\.\d+)?$/.test(hours) || !/^\d+$/.test(crew)) {
    return "";
  }
  return String(Number(hours) * Number(crew));
}
