/** BOM 헤더와 자품목 줄. */

export type BomKind = "prod" | "design";
export type SupplyKind = "buy" | "make" | "outsource";
export type UseKind = "use" | "stop";

export type BomLine = {
  seq: number;
  level: string;
  code: string;
  name: string;
  spec: string;
  qty: string;
  unit: string;
  loss: string;
  supply: SupplyKind;
  route: string;
  place: string;
};

export type Bom = {
  parent: string;
  parentName: string;
  spec: string;
  unit: string;
  kind: BomKind;
  version: string;
  baseQty: string;
  from: string;
  to: string;
  use: UseKind;
  note: string;
  lines: BomLine[];
};

export type BomQuery = {
  parent: string;
  parentName: string;
  kind: BomKind | "";
  use: UseKind | "";
};

/** 모품번, BOM구분, 버전으로 BOM을 가른다. */
export function bomKey(bom: Pick<Bom, "parent" | "kind" | "version">): string {
  return `${bom.parent.trim()}|${bom.kind}|${bom.version.trim()}`;
}
