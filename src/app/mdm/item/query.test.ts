import assert from "node:assert/strict";
import { test } from "node:test";
import { filterItems } from "./query.ts";
import { emptyQuery, seedItems } from "./seed.ts";

const query = emptyQuery();

test("빈 조건은 샘플 8건", () => {
  assert.equal(filterItems(seedItems(), query).length, 8);
});

test("원재료만 남긴다", () => {
  const codes = filterItems(seedItems(), { ...query, asset: "raw" }).map((row) => row.code);
  assert.deepEqual(codes, ["RM-KRFT-01", "RM-INK-01"]);
});

test("품명 일부로 찾는다", () => {
  const codes = filterItems(seedItems(), { ...query, name: "테이프" }).map((row) => row.code);
  assert.deepEqual(codes, ["SM-TAPE-01"]);
});

test("중지 품목만 남긴다", () => {
  const codes = filterItems(seedItems(), { ...query, use: "stop" }).map((row) => row.code);
  assert.deepEqual(codes, ["FG-PLT-01"]);
});

test("품번은 대소문자 없이 맞춘다", () => {
  const codes = filterItems(seedItems(), { ...query, code: "fg" }).map((row) => row.code);
  assert.deepEqual(codes, ["FG-BOX-01", "FG-PLT-01"]);
});
