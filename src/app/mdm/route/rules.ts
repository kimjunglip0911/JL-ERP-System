/** 작업장과 공정 검증, 저장. */

import { blankStep } from "./seed.ts";
import { capHours, routeKey, wcKey, type Route, type RouteStep, type Wc } from "./types.ts";

export { capHours };

const codePattern = /^[A-Za-z0-9-]{1,20}$/;
const amountPattern = /^\d+(\.\d+)?$/;
const intPattern = /^\d+$/;

function positive(value: string): boolean {
  return amountPattern.test(value) && Number(value) > 0;
}

function zeroOrMore(value: string): boolean {
  return value === "" || (amountPattern.test(value) && Number(value) >= 0);
}

/** 저장 전에 작업장을 검사한다. 통과하면 null. */
export function checkWc(draft: Wc, wcs: Wc[], mode: "new" | "edit"): string | null {
  const code = draft.code.trim();
  const name = draft.name.trim();
  if (!code) {
    return "작업장코드를 입력하세요.";
  }
  if (!codePattern.test(code)) {
    return "작업장코드는 영문, 숫자, 하이픈만 사용할 수 있습니다.";
  }
  if (!name || name.length > 80) {
    return "작업장명을 입력하세요.";
  }
  const exists = wcs.some((wc) => wcKey(wc) === code);
  if (mode === "new" && exists) {
    return "이미 등록된 작업장입니다.";
  }
  if (mode === "edit" && !exists) {
    return "등록된 작업장이 없습니다.";
  }
  if (!positive(draft.hours.trim())) {
    return "일가동시간은 0보다 큰 숫자입니다.";
  }
  if (!intPattern.test(draft.crew.trim())) {
    return "가동인원은 0 이상의 정수입니다.";
  }
  if (!intPattern.test(draft.machines.trim())) {
    return "설비대수는 0 이상의 정수입니다.";
  }
  return null;
}

function tidyWc(draft: Wc): Wc {
  return { ...draft, code: draft.code.trim(), name: draft.name.trim(), hours: draft.hours.trim(), crew: draft.crew.trim(), machines: draft.machines.trim() };
}

/** 검증 후 작업장을 추가하거나 같은 코드로 바꾼다. */
export function saveWc(wcs: Wc[], draft: Wc, mode: "new" | "edit"): { wcs: Wc[]; error: string | null } {
  const error = checkWc(draft, wcs, mode);
  if (error) {
    return { wcs, error };
  }
  const next = tidyWc(draft);
  if (mode === "new") {
    return { wcs: [...wcs, next], error: null };
  }
  return { wcs: wcs.map((wc) => (wcKey(wc) === wcKey(next) ? next : wc)), error: null };
}

/** 코드가 같은 작업장을 뺀다. */
export function removeWc(wcs: Wc[], code: string): Wc[] {
  return wcs.filter((wc) => wcKey(wc) !== code);
}

/** 작업장 필드가 같은지 본다. */
export function sameWc(a: Wc, b: Wc): boolean {
  const keys = Object.keys(a) as (keyof Wc)[];
  return keys.every((key) => a[key] === b[key]);
}

/** 저장 전에 공정을 검사한다. 통과하면 null. */
export function checkRoute(draft: Route, routes: Route[], wcs: Wc[], mode: "new" | "edit"): string | null {
  const parent = draft.parent.trim();
  const parentName = draft.parentName.trim();
  if (!parent) {
    return "모품번을 입력하세요.";
  }
  if (!codePattern.test(parent)) {
    return "모품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.";
  }
  if (!parentName || parentName.length > 80) {
    return "모품명을 입력하세요.";
  }
  const exists = routes.some((route) => routeKey(route) === parent);
  if (mode === "new" && exists) {
    return "이미 등록된 공정입니다.";
  }
  if (mode === "edit" && !exists) {
    return "등록된 공정이 없습니다.";
  }
  if (draft.steps.length === 0) {
    return "공정을 한 줄 이상 입력하세요.";
  }
  const known = new Set(wcs.map((wc) => wcKey(wc)));
  for (const step of draft.steps) {
    const code = step.code.trim();
    const name = step.name.trim();
    const wc = step.wc.trim();
    if (!code) {
      return `${step.seq}행 공정코드를 입력하세요.`;
    }
    if (!codePattern.test(code)) {
      return `${step.seq}행 공정코드는 영문, 숫자, 하이픈만 사용할 수 있습니다.`;
    }
    if (!name || name.length > 80) {
      return `${step.seq}행 공정명을 입력하세요.`;
    }
    if (!known.has(wc)) {
      return `${step.seq}행 등록된 작업장이 없습니다.`;
    }
    if (!positive(step.run.trim())) {
      return `${step.seq}행 작업시간은 0보다 큰 숫자입니다.`;
    }
    if (!zeroOrMore(step.setup.trim())) {
      return `${step.seq}행 준비시간은 0 이상의 숫자입니다.`;
    }
    if (!intPattern.test(step.crew.trim())) {
      return `${step.seq}행 표준인원은 0 이상의 정수입니다.`;
    }
  }
  return null;
}

function tidyRoute(draft: Route): Route {
  return {
    ...draft,
    parent: draft.parent.trim(),
    parentName: draft.parentName.trim(),
    steps: draft.steps.map((step, index) => ({
      ...step,
      seq: index + 1,
      code: step.code.trim(),
      name: step.name.trim(),
      wc: step.wc.trim(),
      setup: step.setup.trim(),
      run: step.run.trim(),
      crew: step.crew.trim(),
    })),
  };
}

/** 검증 후 공정을 추가하거나 같은 모품번으로 바꾼다. */
export function saveRoute(
  routes: Route[],
  draft: Route,
  wcs: Wc[],
  mode: "new" | "edit",
): { routes: Route[]; error: string | null } {
  const error = checkRoute(draft, routes, wcs, mode);
  if (error) {
    return { routes, error };
  }
  const next = tidyRoute(draft);
  if (mode === "new") {
    return { routes: [...routes, next], error: null };
  }
  return { routes: routes.map((route) => (routeKey(route) === routeKey(next) ? next : route)), error: null };
}

/** 모품번이 같은 공정을 뺀다. */
export function removeRoute(routes: Route[], parent: string): Route[] {
  return routes.filter((route) => routeKey(route) !== parent);
}

function sameStep(a: RouteStep, b: RouteStep): boolean {
  const keys = Object.keys(a) as (keyof RouteStep)[];
  return keys.every((key) => a[key] === b[key]);
}

/** 공정 헤더와 줄이 같은지 본다. */
export function sameRoute(a: Route, b: Route): boolean {
  if (a.parent !== b.parent || a.parentName !== b.parentName || a.use !== b.use || a.note !== b.note) {
    return false;
  }
  if (a.steps.length !== b.steps.length) {
    return false;
  }
  return a.steps.every((step, index) => sameStep(step, b.steps[index]));
}

/** 저장본을 고치지 않도록 사본을 만든다. */
export function copyRoute(route: Route): Route {
  return { ...route, steps: route.steps.map((step) => ({ ...step })) };
}

/** 작업장 필드 하나만 바꾼 사본. */
export function patchWc<K extends keyof Wc>(wc: Wc, key: K, value: Wc[K]): Wc {
  return { ...wc, [key]: value };
}

/** 공정 헤더 하나만 바꾼 사본. */
export function patchRoute<K extends keyof Route>(route: Route, key: K, value: Route[K]): Route {
  return { ...route, [key]: value };
}

/** 공정 줄의 한 칸을 바꾼 사본. */
export function patchStep<K extends keyof RouteStep>(route: Route, index: number, key: K, value: RouteStep[K]): Route {
  return {
    ...route,
    steps: route.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, [key]: value } : step)),
  };
}

/** 공정 줄을 뒤에 붙인다. */
export function addStep(route: Route): Route {
  return { ...route, steps: [...route.steps.map((step) => ({ ...step })), blankStep(route.steps.length + 1)] };
}

/** 공정 줄을 빼고 순번을 다시 매긴다. */
export function dropStep(route: Route, index: number): Route {
  return {
    ...route,
    steps: route.steps
      .filter((_, stepIndex) => stepIndex !== index)
      .map((step, stepIndex) => ({ ...step, seq: stepIndex + 1 })),
  };
}
