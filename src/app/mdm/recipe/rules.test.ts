import assert from "node:assert/strict";
import { test } from "node:test";
import { addLine, checkRecipe, dropLine, mixQty, ratioSum, removeRecipe, saveRecipe } from "./rules.ts";
import { blankLine, blankRecipe, seedRecipes } from "./seed.ts";
import type { Recipe, RecipeLine } from "./types.ts";

const recipes = seedRecipes();

function line(ratio: string, seq = 1): RecipeLine {
  return { ...blankLine(seq), code: "RM-KRFT-01", name: "크라프트지", ratio, unit: "KG" };
}

function ready(patch: Partial<Recipe> = {}): Recipe {
  return {
    ...blankRecipe(),
    parent: "RM-NEW-01",
    parentName: "신규 처방",
    version: "01",
    batch: "100",
    from: "2026-11-01",
    lines: [line("100")],
    ...patch,
  };
}

test("빈 모품번", () => {
  assert.equal(checkRecipe(ready({ parent: "" }), recipes, "new"), "모품번을 입력하세요.");
});

test("모품번 공백", () => {
  const message = checkRecipe(ready({ parent: "SF PAD" }), recipes, "new");
  assert.equal(message, "모품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.");
});

test("빈 버전", () => {
  assert.equal(checkRecipe(ready({ version: "" }), recipes, "new"), "버전을 입력하세요.");
});

test("신규 처방 중복", () => {
  const draft = { ...recipes[0], lines: recipes[0].lines.map((row) => ({ ...row })) };
  assert.equal(checkRecipe(draft, recipes, "new"), "이미 등록된 처방입니다.");
});

test("수정은 같은 키를 허용한다", () => {
  const draft = { ...recipes[0], lines: recipes[0].lines.map((row) => ({ ...row })) };
  assert.equal(checkRecipe(draft, recipes, "edit"), null);
});

test("기준배치 0", () => {
  assert.equal(checkRecipe(ready({ batch: "0" }), recipes, "new"), "기준배치는 0보다 큰 숫자입니다.");
});

test("성분 줄이 없다", () => {
  assert.equal(checkRecipe(ready({ lines: [] }), recipes, "new"), "성분을 한 줄 이상 입력하세요.");
});

test("배합비 0", () => {
  assert.equal(checkRecipe(ready({ lines: [line("0")] }), recipes, "new"), "1행 배합비는 0보다 크고 100 이하인 숫자입니다.");
});

test("배합비 합계 90", () => {
  const message = checkRecipe(ready({ lines: [line("90")] }), recipes, "new");
  assert.equal(message, "배합비 합계는 100이어야 합니다.");
});

test("배합량은 기준배치와 비율의 곱", () => {
  assert.equal(mixQty("100", "92"), "92");
});

test("배합비 합계", () => {
  assert.equal(ratioSum([line("92", 1), line("8", 2)]), "100");
});

test("신규 저장은 한 건을 더한다", () => {
  const saved = saveRecipe(recipes, ready(), "new");
  assert.equal(saved.error, null);
  assert.equal(saved.recipes.length, 4);
});

test("저장 실패는 목록을 유지한다", () => {
  const saved = saveRecipe(recipes, blankRecipe(), "new");
  assert.equal(saved.error, "모품번을 입력하세요.");
  assert.equal(saved.recipes, recipes);
});

test("처방 삭제는 키를 뺀다", () => {
  const next = removeRecipe(recipes, "SF-COAT-01|01");
  assert.equal(next.some((row) => row.parent === "SF-COAT-01"), false);
  assert.equal(next.length, 2);
});

test("성분 줄을 더하고 빼면 순번이 다시 매겨진다", () => {
  const added = addLine(recipes[2]);
  assert.equal(added.lines.length, 2);
  assert.equal(added.lines[1]?.seq, 2);
  const dropped = dropLine(added, 0);
  assert.equal(dropped.lines.length, 1);
  assert.equal(dropped.lines[0]?.seq, 1);
});
