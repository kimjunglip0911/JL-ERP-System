import assert from "node:assert/strict";
import { test } from "node:test";
import { filterBoms } from "./query.ts";
import { emptyQuery, seedBoms } from "./seed.ts";

const query = emptyQuery();

test("빈 조건은 샘플 5건", () => {
  assert.equal(filterBoms(seedBoms(), query).length, 5);
});

test("모품번 일부로 찾는다", () => {
  const parents = filterBoms(seedBoms(), { ...query, parent: "fg" }).map((row) => row.parent);
  assert.deepEqual(parents, ["FG-BOX-01", "FG-BOX-01", "FG-BOX-01", "FG-PLT-01"]);
});

test("모품명으로 패드를 찾는다", () => {
  const parents = filterBoms(seedBoms(), { ...query, parentName: "패드" }).map((row) => row.parent);
  assert.deepEqual(parents, ["SF-PAD-01"]);
});

test("설계BOM만 남긴다", () => {
  const rows = filterBoms(seedBoms(), { ...query, kind: "design" });
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.version, "01");
  assert.equal(rows[0]?.kind, "design");
});

test("중지 BOM만 남긴다", () => {
  const parents = filterBoms(seedBoms(), { ...query, use: "stop" }).map((row) => row.parent);
  assert.deepEqual(parents, ["FG-PLT-01"]);
});
