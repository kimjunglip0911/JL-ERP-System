import assert from "node:assert/strict";
import { test } from "node:test";
import { filterRoutes, filterWcs } from "./query.ts";
import { emptyRouteQuery, emptyWcQuery, seedRoutes, seedWcs } from "./seed.ts";

const wcQuery = emptyWcQuery();
const routeQuery = emptyRouteQuery();

test("작업장 샘플은 4건", () => {
  assert.equal(filterWcs(seedWcs(), wcQuery).length, 4);
});

test("공정 샘플은 3건", () => {
  assert.equal(filterRoutes(seedRoutes(), routeQuery).length, 3);
});

test("작업장 코드 일부로 찾는다", () => {
  const codes = filterWcs(seedWcs(), { ...wcQuery, code: "cut" }).map((row) => row.code);
  assert.deepEqual(codes, ["WC-CUT"]);
});

test("외주 작업장만 남긴다", () => {
  const codes = filterWcs(seedWcs(), { ...wcQuery, kind: "out" }).map((row) => row.code);
  assert.deepEqual(codes, ["WC-OUT"]);
});

test("중지 작업장만 남긴다", () => {
  const codes = filterWcs(seedWcs(), { ...wcQuery, use: "stop" }).map((row) => row.code);
  assert.deepEqual(codes, ["WC-OUT"]);
});

test("모품번 일부로 공정을 찾는다", () => {
  const parents = filterRoutes(seedRoutes(), { ...routeQuery, parent: "fg" }).map((row) => row.parent);
  assert.deepEqual(parents, ["FG-BOX-01", "FG-PLT-01"]);
});

test("모품명으로 패드를 찾는다", () => {
  const parents = filterRoutes(seedRoutes(), { ...routeQuery, parentName: "패드" }).map((row) => row.parent);
  assert.deepEqual(parents, ["SF-PAD-01"]);
});

test("중지 공정만 남긴다", () => {
  const parents = filterRoutes(seedRoutes(), { ...routeQuery, use: "stop" }).map((row) => row.parent);
  assert.deepEqual(parents, ["FG-PLT-01"]);
});
