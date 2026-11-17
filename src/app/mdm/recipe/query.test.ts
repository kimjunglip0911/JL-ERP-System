import assert from "node:assert/strict";
import { test } from "node:test";
import { filterRecipes } from "./query.ts";
import { emptyQuery, seedRecipes } from "./seed.ts";

const query = emptyQuery();

test("빈 조건은 샘플 3건", () => {
  assert.equal(filterRecipes(seedRecipes(), query).length, 3);
});

test("모품번 일부로 패드를 찾는다", () => {
  const parents = filterRecipes(seedRecipes(), { ...query, parent: "pad" }).map((row) => row.parent);
  assert.deepEqual(parents, ["SF-PAD-01", "SF-PAD-01"]);
});

test("모품명으로 코팅을 찾는다", () => {
  const parents = filterRecipes(seedRecipes(), { ...query, parentName: "코팅" }).map((row) => row.parent);
  assert.deepEqual(parents, ["SF-COAT-01"]);
});

test("중지 처방만 남긴다", () => {
  const parents = filterRecipes(seedRecipes(), { ...query, use: "stop" }).map((row) => row.parent);
  assert.deepEqual(parents, ["SF-COAT-01"]);
});
