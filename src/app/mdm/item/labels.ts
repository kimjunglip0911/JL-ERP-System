/** 품목 화면의 한글 라벨과 탭 필드. */

import type { AssetKind, Item, SourceKind, SupplyKind, TaxKind, UseKind } from "./types";

type Option<T extends string> = { value: T; label: string };

export const assetOptions = [
  { value: "product", label: "제품" },
  { value: "semi", label: "반제품" },
  { value: "goods", label: "상품" },
  { value: "raw", label: "원재료" },
  { value: "sub", label: "부재료" },
  { value: "supply", label: "저장품" },
] as const satisfies readonly Option<AssetKind>[];

export const taxOptions = [
  { value: "tax", label: "과세" },
  { value: "free", label: "면세" },
  { value: "zero", label: "영세" },
] as const satisfies readonly Option<TaxKind>[];

export const sourceOptions = [
  { value: "domestic", label: "내자" },
  { value: "import", label: "외자" },
] as const satisfies readonly Option<SourceKind>[];

export const supplyOptions = [
  { value: "buy", label: "구매" },
  { value: "make", label: "생산" },
  { value: "outsource", label: "외주" },
] as const satisfies readonly Option<SupplyKind>[];

export const useOptions = [
  { value: "use", label: "사용" },
  { value: "stop", label: "중지" },
] as const satisfies readonly Option<UseKind>[];

export type FieldSpec =
  | { key: keyof Item; label: string; kind: "text"; lockOnEdit?: boolean }
  | { key: keyof Item; label: string; kind: "select"; options: readonly Option<string>[] }
  | { key: keyof Item; label: string; kind: "check" };

export type ItemTab = "base" | "buy" | "sell" | "stock";

export const baseFields: FieldSpec[] = [
  { key: "code", label: "품번", kind: "text", lockOnEdit: true },
  { key: "name", label: "품명", kind: "text" },
  { key: "shortName", label: "품목약칭", kind: "text" },
  { key: "engName", label: "영문명", kind: "text" },
  { key: "spec", label: "규격", kind: "text" },
  { key: "asset", label: "품목자산분류", kind: "select", options: assetOptions },
  { key: "classL", label: "대분류", kind: "text" },
  { key: "classM", label: "중분류", kind: "text" },
  { key: "classS", label: "소분류", kind: "text" },
  { key: "stockUnit", label: "재고단위", kind: "text" },
  { key: "buyUnit", label: "구매단위", kind: "text" },
  { key: "sellUnit", label: "판매단위", kind: "text" },
  { key: "tax", label: "과세구분", kind: "select", options: taxOptions },
  { key: "source", label: "내외자구분", kind: "select", options: sourceOptions },
  { key: "use", label: "사용여부", kind: "select", options: useOptions },
];

export const buyFields: FieldSpec[] = [
  { key: "supply", label: "조달구분", kind: "select", options: supplyOptions },
  { key: "vendor", label: "구매처", kind: "text" },
  { key: "buyPrice", label: "구매단가", kind: "text" },
  { key: "minBuyQty", label: "최소구매수량", kind: "text" },
  { key: "leadDays", label: "리드타임(일)", kind: "text" },
  { key: "inspect", label: "입고검사", kind: "check" },
];

export const sellFields: FieldSpec[] = [
  { key: "sellPrice", label: "판매단가", kind: "text" },
  { key: "shipWh", label: "출고창고", kind: "text" },
  { key: "minSellQty", label: "최소판매수량", kind: "text" },
];

export const stockFields: FieldSpec[] = [
  { key: "stockOn", label: "재고관리", kind: "check" },
  { key: "lotOn", label: "LOT관리", kind: "check" },
  { key: "serialOn", label: "Serial관리", kind: "check" },
  { key: "safetyQty", label: "안전재고", kind: "text" },
  { key: "homeWh", label: "기본창고", kind: "text" },
  { key: "barcode", label: "바코드", kind: "text" },
];

export const tabOptions: { id: ItemTab; label: string }[] = [
  { id: "base", label: "기본" },
  { id: "buy", label: "구매" },
  { id: "sell", label: "영업" },
  { id: "stock", label: "재고" },
];

/** 탭에 해당하는 필드 목록. */
export function fieldsOf(tab: ItemTab): FieldSpec[] {
  if (tab === "buy") {
    return buyFields;
  }
  if (tab === "sell") {
    return sellFields;
  }
  if (tab === "stock") {
    return stockFields;
  }
  return baseFields;
}

/** 품목자산분류 한글 이름. */
export function assetLabel(value: AssetKind): string {
  const found = assetOptions.find((option) => option.value === value);
  return found ? found.label : value;
}

/** 사용여부 한글 이름. */
export function useLabel(value: UseKind): string {
  const found = useOptions.find((option) => option.value === value);
  return found ? found.label : value;
}
