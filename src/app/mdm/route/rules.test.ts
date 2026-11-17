import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addStep,
  capHours,
  checkRoute,
  checkWc,
  dropStep,
  removeRoute,
  saveWc,
} from "./rules.ts";
import { blankRoute, blankWc, seedRoutes, seedWcs } from "./seed.ts";
import type { Route, Wc } from "./types.ts";

const wcs = seedWcs();
const routes = seedRoutes();

function readyWc(patch: Partial<Wc> = {}): Wc {
  return { ...blankWc(), code: "WC-NEW", name: "신규 작업장", hours: "8", crew: "2", ...patch };
}

function readyRoute(patch: Partial<Route> = {}): Route {
  const step = addStep(blankRoute());
  step.steps[0].code = "OP-10";
  step.steps[0].name = "재단";
  step.steps[0].wc = "WC-CUT";
  step.steps[0].run = "5";
  return { ...step, parent: "RM-NEW-01", parentName: "신규 모품목", ...patch, steps: patch.steps ?? step.steps };
}

test("빈 작업장코드", () => {
  assert.equal(checkWc(readyWc({ code: "" }), wcs, "new"), "작업장코드를 입력하세요.");
});

test("작업장코드 공백", () => {
  const message = checkWc(readyWc({ code: "WC NEW" }), wcs, "new");
  assert.equal(message, "작업장코드는 영문, 숫자, 하이픈만 사용할 수 있습니다.");
});

test("신규 작업장 중복", () => {
  assert.equal(checkWc({ ...wcs[0] }, wcs, "new"), "이미 등록된 작업장입니다.");
});

test("수정은 같은 작업장코드를 허용한다", () => {
  assert.equal(checkWc({ ...wcs[0] }, wcs, "edit"), null);
});

test("일가동시간 0", () => {
  assert.equal(checkWc(readyWc({ hours: "0" }), wcs, "new"), "일가동시간은 0보다 큰 숫자입니다.");
});

test("가동인원 소수", () => {
  assert.equal(checkWc(readyWc({ crew: "1.5" }), wcs, "new"), "가동인원은 0 이상의 정수입니다.");
});

test("생산능력은 시간과 인원의 곱", () => {
  assert.equal(capHours(wcs[0]), "32");
});

test("빈 모품번", () => {
  assert.equal(checkRoute(readyRoute({ parent: "" }), routes, wcs, "new"), "모품번을 입력하세요.");
});

test("신규 공정 중복", () => {
  const draft = { ...routes[0], steps: routes[0].steps.map((step) => ({ ...step })) };
  assert.equal(checkRoute(draft, routes, wcs, "new"), "이미 등록된 공정입니다.");
});

test("공정 줄이 없다", () => {
  assert.equal(checkRoute(readyRoute({ steps: [] }), routes, wcs, "new"), "공정을 한 줄 이상 입력하세요.");
});

test("없는 작업장", () => {
  const draft = readyRoute();
  draft.steps[0].wc = "WC-NONE";
  assert.equal(checkRoute(draft, routes, wcs, "new"), "1행 등록된 작업장이 없습니다.");
});

test("작업시간 0", () => {
  const draft = readyRoute();
  draft.steps[0].run = "0";
  assert.equal(checkRoute(draft, routes, wcs, "new"), "1행 작업시간은 0보다 큰 숫자입니다.");
});

test("신규 작업장 저장은 한 건을 더한다", () => {
  const saved = saveWc(wcs, readyWc(), "new");
  assert.equal(saved.error, null);
  assert.equal(saved.wcs.length, 5);
});

test("작업장 저장 실패는 목록을 유지한다", () => {
  const saved = saveWc(wcs, blankWc(), "new");
  assert.equal(saved.error, "작업장코드를 입력하세요.");
  assert.equal(saved.wcs, wcs);
});

test("공정 삭제는 모품번을 뺀다", () => {
  const next = removeRoute(routes, "SF-PAD-01");
  assert.equal(next.some((row) => row.parent === "SF-PAD-01"), false);
  assert.equal(next.length, 2);
});

test("공정 줄을 더하고 빼면 순번이 다시 매겨진다", () => {
  const added = addStep(routes[1]);
  assert.equal(added.steps.length, 2);
  assert.equal(added.steps[1]?.seq, 2);
  const dropped = dropStep(added, 0);
  assert.equal(dropped.steps.length, 1);
  assert.equal(dropped.steps[0]?.seq, 1);
});
