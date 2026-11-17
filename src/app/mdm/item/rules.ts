/** 품목 검증, 저장, 삭제. */

import type { Item } from "./types";

const codePattern = /^[A-Za-z0-9-]{1,20}$/;
const amountPattern = /^\d+(\.\d+)?$/;
const dayPattern = /^\d+$/;

const amountFields: { key: keyof Item; label: string }[] = [
  { key: "buyPrice", label: "구매단가" },
  { key: "minBuyQty", label: "최소구매수량" },
  { key: "sellPrice", label: "판매단가" },
  { key: "minSellQty", label: "최소판매수량" },
  { key: "safetyQty", label: "안전재고" },
];

function amountMessage(label: string): string {
  const last = label.charCodeAt(label.length - 1);
  const noBatchim = Number.isNaN(last) || (last - 0xac00) % 28 === 0;
  return `${label}${noBatchim ? "는" : "은"} 0 이상의 숫자입니다.`;
}

/** 저장 전에 품목을 검사한다. 통과하면 null. */
export function checkItem(draft: Item, items: Item[], mode: "new" | "edit"): string | null {
  const code = draft.code.trim();
  const name = draft.name.trim();
  if (!code) {
    return "품번을 입력하세요.";
  }
  if (!codePattern.test(code)) {
    return "품번은 영문, 숫자, 하이픈만 사용할 수 있습니다.";
  }
  if (!name || name.length > 80) {
    return "품명을 입력하세요.";
  }
  const exists = items.some((item) => item.code === code);
  if (mode === "new" && exists) {
    return "이미 등록된 품번입니다.";
  }
  if (mode === "edit" && !exists) {
    return "등록된 품목이 없습니다.";
  }
  for (const field of amountFields) {
    const value = String(draft[field.key]).trim();
    if (value && !amountPattern.test(value)) {
      return amountMessage(field.label);
    }
  }
  const days = draft.leadDays.trim();
  if (days && !dayPattern.test(days)) {
    return "리드타임은 0 이상의 정수입니다.";
  }
  return null;
}

/** 검증 후 신규는 추가하고 수정은 같은 품번을 바꾼다. */
export function saveItem(
  items: Item[],
  draft: Item,
  mode: "new" | "edit",
): { items: Item[]; error: string | null } {
  const error = checkItem(draft, items, mode);
  if (error) {
    return { items, error };
  }
  const next: Item = { ...draft, code: draft.code.trim(), name: draft.name.trim() };
  if (mode === "new") {
    return { items: [...items, next], error: null };
  }
  return {
    items: items.map((item) => (item.code === next.code ? next : item)),
    error: null,
  };
}

/** 품번이 같은 행을 뺀다. */
export function removeItem(items: Item[], code: string): Item[] {
  return items.filter((item) => item.code !== code);
}

/** 필드 값이 모두 같은지 본다. */
export function sameItem(a: Item, b: Item): boolean {
  const keys = Object.keys(a) as (keyof Item)[];
  return keys.every((key) => a[key] === b[key]);
}

/** 한 필드만 바꾼 품목 사본. */
export function patchItem<K extends keyof Item>(item: Item, key: K, value: Item[K]): Item {
  return { ...item, [key]: value };
}
