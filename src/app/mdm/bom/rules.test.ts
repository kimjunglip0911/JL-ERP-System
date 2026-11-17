import assert from "node:assert/strict";
import { test } from "node:test";
import { addLine, checkBom, dropLine, removeBom, sameBom, saveBom } from "./rules.ts";
import { blankBom, seedBoms } from "./seed.ts";
import { bomKey, type Bom } from "./types.ts";

const boms = seedBoms();

function ready(patch: Partial<Bom> = {}): Bom {
  return {
    ...blankBom(),
    parent: "RM-NEW-01",
    parentName: "신규 모품목",
    from: "2026-11-01",
    ...patch,
  };
}

test("빈 모품번", () => {
  assert.equal(checkBom(ready({ parent: "" }), boms, "new"), "모품번을 입력하세요.");
});

test("모품번 공백", () => {
  const message = checkBom(ready({ parent: "FG BOX" }), boms, "new");
  assert.equal(message, "모품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.");
});

test("빈 모품명", () => {
  assert.equal(checkBom(ready({ parentName: "" }), boms, "new"), "모품명을 입력하세요.");
});

test("신규 키 중복", () => {
  assert.equal(checkBom({ ...boms[0] }, boms, "new"), "이미 등록된 BOM입니다.");
});

test("수정은 같은 키를 허용한다", () => {
  assert.equal(checkBom({ ...boms[0], lines: boms[0].lines.map((line) => ({ ...line })) }, boms, "edit"), null);
});

test("빈 버전", () => {
  assert.equal(checkBom(ready({ version: "" }), boms, "new"), "버전을 입력하세요.");
});

test("기준수량 0", () => {
  assert.equal(checkBom(ready({ baseQty: "0" }), boms, "new"), "기준수량은 0보다 큰 숫자입니다.");
});

test("적용시작일 형식", () => {
  assert.equal(checkBom(ready({ from: "2026/01/01" }), boms, "new"), "적용시작일은 YYYY-MM-DD입니다.");
});

test("적용종료일이 시작보다 빠르다", () => {
  const message = checkBom(ready({ from: "2026-06-01", to: "2026-01-01" }), boms, "new");
  assert.equal(message, "적용종료일은 적용시작일 이후입니다.");
});

test("자품번이 모품번과 같다", () => {
  const draft = addLine(ready());
  draft.lines[0].code = "RM-NEW-01";
  draft.lines[0].name = "자기 자신";
  draft.lines[0].qty = "1";
  assert.equal(checkBom(draft, boms, "new"), "1행 모품번과 같은 자품번은 넣을 수 없습니다.");
});

test("소요량 0", () => {
  const draft = addLine(ready());
  draft.lines[0].code = "SF-PAD-01";
  draft.lines[0].name = "완충 패드";
  draft.lines[0].qty = "0";
  assert.equal(checkBom(draft, boms, "new"), "1행 소요량은 0보다 큰 숫자입니다.");
});

test("헤더만 있는 BOM은 저장할 수 있다", () => {
  assert.equal(checkBom(ready(), boms, "new"), null);
});

test("신규 저장은 한 건을 더한다", () => {
  const saved = saveBom(boms, ready(), "new");
  assert.equal(saved.error, null);
  assert.equal(saved.boms.length, 6);
});

test("저장 실패는 목록을 유지한다", () => {
  const saved = saveBom(boms, blankBom(), "new");
  assert.equal(saved.error, "모품번을 입력하세요.");
  assert.equal(saved.boms, boms);
});

test("삭제는 키를 뺀다", () => {
  const next = removeBom(boms, bomKey(boms[3]));
  assert.equal(next.some((row) => row.parent === "SF-PAD-01"), false);
  assert.equal(next.length, 4);
});

test("같은 BOM은 같다", () => {
  const copy = { ...boms[0], lines: boms[0].lines.map((line) => ({ ...line })) };
  assert.equal(sameBom(boms[0], copy), true);
  const changed = { ...copy, lines: copy.lines.map((line, index) => (index === 0 ? { ...line, qty: "9" } : line)) };
  assert.equal(sameBom(boms[0], changed), false);
});

test("자품목 줄을 더하고 빼면 순번이 다시 매겨진다", () => {
  const added = addLine(boms[3]);
  assert.equal(added.lines.length, 2);
  assert.equal(added.lines[1]?.seq, 2);
  const dropped = dropLine(added, 0);
  assert.equal(dropped.lines.length, 1);
  assert.equal(dropped.lines[0]?.seq, 1);
});
