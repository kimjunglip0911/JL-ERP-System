import assert from "node:assert/strict";
import { test } from "node:test";
import { checkItem, removeItem, sameItem, saveItem } from "./rules.ts";
import { blankItem, seedItems } from "./seed.ts";
import type { Item } from "./types.ts";

const items = seedItems();

function draftOf(patch: Partial<Item>): Item {
  return { ...blankItem(), ...patch };
}

test("빈 품번", () => {
  assert.equal(checkItem(draftOf({ name: "이름" }), items, "new"), "품번을 입력하세요.");
});

test("빈 품명", () => {
  assert.equal(checkItem(draftOf({ code: "RM-NEW-01" }), items, "new"), "품명을 입력하세요.");
});

test("신규 품번 중복", () => {
  assert.equal(checkItem({ ...items[0] }, items, "new"), "이미 등록된 품번입니다.");
});

test("수정은 같은 품번을 허용한다", () => {
  assert.equal(checkItem({ ...items[0] }, items, "edit"), null);
});

test("품번 공백", () => {
  const message = checkItem(draftOf({ code: "FG BOX", name: "이름" }), items, "new");
  assert.equal(message, "품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.");
});

test("한글 품번", () => {
  const message = checkItem(draftOf({ code: "품번", name: "이름" }), items, "new");
  assert.equal(message, "품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.");
});

test("구매단가 문자", () => {
  const message = checkItem({ ...items[0], buyPrice: "abc" }, items, "edit");
  assert.equal(message, "구매단가는 0 이상의 숫자입니다.");
});

test("구매단가 음수", () => {
  const message = checkItem({ ...items[0], buyPrice: "-1" }, items, "edit");
  assert.equal(message, "구매단가는 0 이상의 숫자입니다.");
});

test("빈 구매단가", () => {
  assert.equal(checkItem({ ...items[0], buyPrice: "" }, items, "edit"), null);
});

test("리드타임 소수", () => {
  const message = checkItem({ ...items[0], leadDays: "1.5" }, items, "edit");
  assert.equal(message, "리드타임은 0 이상의 정수입니다.");
});

test("리드타임 정수", () => {
  assert.equal(checkItem({ ...items[0], leadDays: "3" }, items, "edit"), null);
});

test("신규 저장은 한 건을 더한다", () => {
  const saved = saveItem(items, draftOf({ code: "RM-NEW-01", name: "신규품목" }), "new");
  assert.equal(saved.error, null);
  assert.equal(saved.items.length, 9);
});

test("저장 실패는 목록을 유지한다", () => {
  const saved = saveItem(items, blankItem(), "new");
  assert.equal(saved.error, "품번을 입력하세요.");
  assert.equal(saved.items, items);
});

test("삭제는 품번을 뺀다", () => {
  const next = removeItem(items, "SM-TAPE-01");
  assert.equal(next.some((row) => row.code === "SM-TAPE-01"), false);
  assert.equal(next.length, 7);
});

test("같은 품목은 같다", () => {
  assert.equal(sameItem(items[0], { ...items[0] }), true);
  assert.equal(sameItem(items[0], { ...items[0], name: "다름" }), false);
});
