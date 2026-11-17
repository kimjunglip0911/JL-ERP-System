/** 처방 검증, 저장, 성분 줄. */

import { blankLine } from "./seed.ts";
import { recipeKey, type Recipe, type RecipeLine } from "./types.ts";

const codePattern = /^[A-Za-z0-9-]{1,20}$/;
const versionPattern = /^[A-Za-z0-9.]{1,10}$/;
const amountPattern = /^\d+(\.\d+)?$/;

function amount(value: string): number | null {
  const text = value.trim();
  if (!amountPattern.test(text)) {
    return null;
  }
  return Number(text);
}

function plain(value: number): string {
  return String(Number(value.toFixed(6)));
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** 기준배치와 배합비로 배합량을 계산한다. */
export function mixQty(batch: string, ratio: string): string {
  const base = amount(batch);
  const part = amount(ratio);
  if (base === null || part === null) {
    return "";
  }
  return plain((base * part) / 100);
}

/** 배합비 합계. */
export function ratioSum(lines: RecipeLine[]): string {
  const total = lines.reduce((sum, line) => {
    const part = amount(line.ratio);
    return part === null ? sum : sum + part;
  }, 0);
  return plain(total);
}

/** 저장 전에 처방을 검사한다. 통과하면 null. */
export function checkRecipe(draft: Recipe, recipes: Recipe[], mode: "new" | "edit"): string | null {
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
  const key = `${parent}|${version}`;
  const exists = recipes.some((recipe) => recipeKey(recipe) === key);
  if (mode === "new" && exists) {
    return "이미 등록된 처방입니다.";
  }
  if (mode === "edit" && !exists) {
    return "등록된 처방이 없습니다.";
  }
  const batch = amount(draft.batch);
  if (batch === null || batch <= 0) {
    return "기준배치는 0보다 큰 숫자입니다.";
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
  if (draft.lines.length === 0) {
    return "성분을 한 줄 이상 입력하세요.";
  }
  for (const line of draft.lines) {
    const code = line.code.trim();
    const name = line.name.trim();
    const ratio = amount(line.ratio);
    if (!code) {
      return `${line.seq}행 성분코드를 입력하세요.`;
    }
    if (!codePattern.test(code)) {
      return `${line.seq}행 성분코드는 영문, 숫자, 하이픈만 사용할 수 있습니다.`;
    }
    if (!name || name.length > 80) {
      return `${line.seq}행 성분명을 입력하세요.`;
    }
    if (ratio === null || ratio <= 0 || ratio > 100) {
      return `${line.seq}행 배합비는 0보다 크고 100 이하인 숫자입니다.`;
    }
    const tol = line.tol.trim();
    if (tol) {
      const band = amount(tol);
      if (band === null || band < 0 || band > 100) {
        return `${line.seq}행 허용오차는 0 이상 100 이하의 숫자입니다.`;
      }
    }
  }
  const total = Number(ratioSum(draft.lines));
  if (total < 99.995 || total >= 100.005) {
    return "배합비 합계는 100이어야 합니다.";
  }
  return null;
}

function tidy(draft: Recipe): Recipe {
  return {
    ...draft,
    parent: draft.parent.trim(),
    parentName: draft.parentName.trim(),
    version: draft.version.trim(),
    batch: draft.batch.trim(),
    from: draft.from.trim(),
    to: draft.to.trim(),
    lines: draft.lines.map((line, index) => ({
      ...line,
      seq: index + 1,
      code: line.code.trim(),
      name: line.name.trim(),
      ratio: line.ratio.trim(),
      tol: line.tol.trim(),
    })),
  };
}

/** 검증 후 처방을 추가하거나 같은 키로 바꾼다. */
export function saveRecipe(recipes: Recipe[], draft: Recipe, mode: "new" | "edit"): { recipes: Recipe[]; error: string | null } {
  const error = checkRecipe(draft, recipes, mode);
  if (error) {
    return { recipes, error };
  }
  const next = tidy(draft);
  if (mode === "new") {
    return { recipes: [...recipes, next], error: null };
  }
  return { recipes: recipes.map((recipe) => (recipeKey(recipe) === recipeKey(next) ? next : recipe)), error: null };
}

/** 키가 같은 처방을 뺀다. */
export function removeRecipe(recipes: Recipe[], key: string): Recipe[] {
  return recipes.filter((recipe) => recipeKey(recipe) !== key);
}

function sameLine(a: RecipeLine, b: RecipeLine): boolean {
  const keys = Object.keys(a) as (keyof RecipeLine)[];
  return keys.every((key) => a[key] === b[key]);
}

/** 헤더와 성분 줄이 같은지 본다. */
export function sameRecipe(a: Recipe, b: Recipe): boolean {
  const keys = ["parent", "parentName", "version", "batch", "unit", "from", "to", "use", "note"] as const;
  if (!keys.every((key) => a[key] === b[key])) {
    return false;
  }
  if (a.lines.length !== b.lines.length) {
    return false;
  }
  return a.lines.every((line, index) => sameLine(line, b.lines[index]));
}

/** 저장본을 고치지 않도록 사본을 만든다. */
export function copyRecipe(recipe: Recipe): Recipe {
  return { ...recipe, lines: recipe.lines.map((line) => ({ ...line })) };
}

/** 헤더 필드 하나만 바꾼 사본. */
export function patchRecipe<K extends keyof Recipe>(recipe: Recipe, key: K, value: Recipe[K]): Recipe {
  return { ...recipe, [key]: value };
}

/** 성분 줄의 한 칸을 바꾼 사본. */
export function patchLine<K extends keyof RecipeLine>(recipe: Recipe, index: number, key: K, value: RecipeLine[K]): Recipe {
  return {
    ...recipe,
    lines: recipe.lines.map((line, lineIndex) => (lineIndex === index ? { ...line, [key]: value } : line)),
  };
}

/** 성분 줄을 뒤에 붙인다. */
export function addLine(recipe: Recipe): Recipe {
  return { ...recipe, lines: [...recipe.lines.map((line) => ({ ...line })), blankLine(recipe.lines.length + 1)] };
}

/** 성분 줄을 빼고 순번을 다시 매긴다. */
export function dropLine(recipe: Recipe, index: number): Recipe {
  return {
    ...recipe,
    lines: recipe.lines.filter((_, lineIndex) => lineIndex !== index).map((line, lineIndex) => ({ ...line, seq: lineIndex + 1 })),
  };
}
