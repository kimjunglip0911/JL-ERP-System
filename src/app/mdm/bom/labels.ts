/** BOM 화면의 한글 라벨. */

import type { BomKind, SupplyKind, UseKind } from "./types";

type Option<T extends string> = { value: T; label: string };

export const kindOptions = [
  { value: "prod", label: "생산BOM" },
  { value: "design", label: "설계BOM" },
] as const satisfies readonly Option<BomKind>[];

export const supplyOptions = [
  { value: "buy", label: "구매" },
  { value: "make", label: "생산" },
  { value: "outsource", label: "외주" },
] as const satisfies readonly Option<SupplyKind>[];

export const useOptions = [
  { value: "use", label: "사용" },
  { value: "stop", label: "중지" },
] as const satisfies readonly Option<UseKind>[];

/** BOM구분 한글 이름. */
export function kindLabel(value: BomKind): string {
  const found = kindOptions.find((option) => option.value === value);
  return found ? found.label : value;
}

/** 사용여부 한글 이름. */
export function useLabel(value: UseKind): string {
  const found = useOptions.find((option) => option.value === value);
  return found ? found.label : value;
}
