/** BOM 검증, 저장, 자품목 줄. */

import { bomKey, type Bom, type BomLine } from "./types.ts";

const codePattern = /^[A-Za-z0-9-]{1,20}$/;
const versionPattern = /^[A-Za-z0-9.]{1,10}$/;
const amountPattern = /^\d+(\.\d+)?$/;

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function positive(value: string): boolean {
  return amountPattern.test(value) && Number(value) > 0;
}

function lossOk(value: string): boolean {
  if (!value) {
    return true;
  }
  if (!amountPattern.test(value)) {
    return false;
  }
  const number = Number(value);
  return number >= 0 && number <= 100;
}

/** 저장 전에 BOM을 검사한다. 통과하면 null. */
export function checkBom(draft: Bom, boms: Bom[], mode: "new" | "edit"): string | null {
  const parent = draft.parent.trim();
  const parentName = draft.parentName.trim();
  const version = draft.version.trim();
  if (!parent) {
    return "모품번을 입력하세요.";
  }
  if (!codePattern.test(parent)) {
    return "모품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.";
  }
  if (!parentName || parentName.length > 80) {
    return "모품명을 입력하세요.";
  }
  if (!version) {
    return "버전을 입력하세요.";
  }
  if (!versionPattern.test(version)) {
    return "버전은 영문, 숫자, 점만 사용할 수 있습니다.";
  }
  const key = `${parent}|${draft.kind}|${version}`;
  const exists = boms.some((bom) => bomKey(bom) === key);
  if (mode === "new" && exists) {
    return "이미 등록된 BOM입니다.";
  }
  if (mode === "edit" && !exists) {
    return "등록된 BOM이 없습니다.";
  }
  const baseQty = draft.baseQty.trim();
  if (!baseQty) {
    return "기준수량을 입력하세요.";
  }
  if (!positive(baseQty)) {
    return "기준수량은 0보다 큰 숫자입니다.";
  }
  const from = draft.from.trim();
  if (!from) {
    return "적용시작일을 입력하세요.";
  }
  if (!validDate(from)) {
    return "적용시작일은 YYYY-MM-DD입니다.";
  }
  const to = draft.to.trim();
  if (to && !validDate(to)) {
    return "적용종료일은 YYYY-MM-DD입니다.";
  }
  if (to && to < from) {
    return "적용종료일은 적용시작일 이후입니다.";
  }
  for (const line of draft.lines) {
    const code = line.code.trim();
    const name = line.name.trim();
    const qty = line.qty.trim();
    const level = line.level.trim();
    if (!code) {
      return `${line.seq}행 자품번을 입력하세요.`;
    }
    if (!codePattern.test(code)) {
      return `${line.seq}행 자품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.`;
    }
    if (code === parent) {
      return `${line.seq}행 모품번과 같은 자품번은 넣을 수 없습니다.`;
    }
    if (!name || name.length > 80) {
      return `${line.seq}행 자품명을 입력하세요.`;
    }
    if (!positive(qty)) {
      return `${line.seq}행 소요량은 0보다 큰 숫자입니다.`;
    }
    if (!lossOk(line.loss.trim())) {
      return `${line.seq}행 손실률은 0 이상 100 이하의 숫자입니다.`;
    }
    if (!/^[1-9]$/.test(level)) {
      return `${line.seq}행 레벨은 1부터 9까지의 정수입니다.`;
    }
  }
  return null;
}

function tidy(draft: Bom): Bom {
  return {
    ...draft,
    parent: draft.parent.trim(),
    parentName: draft.parentName.trim(),
    version: draft.version.trim(),
    baseQty: draft.baseQty.trim(),
    from: draft.from.trim(),
    to: draft.to.trim(),
    lines: draft.lines.map((line, index) => ({
      ...line,
      seq: index + 1,
      code: line.code.trim(),
      name: line.name.trim(),
      qty: line.qty.trim(),
      loss: line.loss.trim(),
      level: line.level.trim(),
    })),
  };
}

/** 검증 후 신규는 추가하고 수정은 같은 키를 바꾼다. */
export function saveBom(
  boms: Bom[],
  draft: Bom,
  mode: "new" | "edit",
): { boms: Bom[]; error: string | null } {
  const error = checkBom(draft, boms, mode);
  if (error) {
    return { boms, error };
  }
  const next = tidy(draft);
  const key = bomKey(next);
  if (mode === "new") {
    return { boms: [...boms, next], error: null };
  }
  return {
    boms: boms.map((bom) => (bomKey(bom) === key ? next : bom)),
    error: null,
  };
}

/** 키가 같은 BOM을 뺀다. */
export function removeBom(boms: Bom[], key: string): Bom[] {
  return boms.filter((bom) => bomKey(bom) !== key);
}

function sameLine(a: BomLine, b: BomLine): boolean {
  const keys = Object.keys(a) as (keyof BomLine)[];
  return keys.every((key) => a[key] === b[key]);
}

/** 헤더와 자품목 줄이 모두 같은지 본다. */
export function sameBom(a: Bom, b: Bom): boolean {
  const keys = ["parent", "parentName", "spec", "unit", "kind", "version", "baseQty", "from", "to", "use", "note"] as const;
  if (!keys.every((key) => a[key] === b[key])) {
    return false;
  }
  if (a.lines.length !== b.lines.length) {
    return false;
  }
  return a.lines.every((line, index) => sameLine(line, b.lines[index]));
}

/** 저장본을 고치지 않도록 사본을 만든다. */
export function copyBom(bom: Bom): Bom {
  return { ...bom, lines: bom.lines.map((line) => ({ ...line })) };
}

/** 헤더 필드 하나만 바꾼 사본. */
export function patchBom<K extends keyof Bom>(bom: Bom, key: K, value: Bom[K]): Bom {
  return { ...bom, [key]: value };
}

/** 자품목 줄의 한 칸을 바꾼 사본. */
export function patchLine<K extends keyof BomLine>(bom: Bom, index: number, key: K, value: BomLine[K]): Bom {
  return {
    ...bom,
    lines: bom.lines.map((line, lineIndex) => (lineIndex === index ? { ...line, [key]: value } : line)),
  };
}

/** 자품목 줄을 뒤에 붙인다. */
export function addLine(bom: Bom): Bom {
  const seq = bom.lines.length + 1;
  const line: BomLine = {
    seq,
    level: "1",
    code: "",
    name: "",
    spec: "",
    qty: "",
    unit: "EA",
    loss: "",
    supply: "buy",
    route: "",
    place: "",
  };
  return { ...bom, lines: [...bom.lines, line] };
}

/** 자품목 줄을 빼고 순번을 다시 매긴다. */
export function dropLine(bom: Bom, index: number): Bom {
  return {
    ...bom,
    lines: bom.lines.filter((_, lineIndex) => lineIndex !== index).map((line, lineIndex) => ({ ...line, seq: lineIndex + 1 })),
  };
}
