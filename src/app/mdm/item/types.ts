/** 품목 마스터의 값 모양. */

export type AssetKind = "product" | "semi" | "goods" | "raw" | "sub" | "supply";
export type TaxKind = "tax" | "free" | "zero";
export type SourceKind = "domestic" | "import";
export type SupplyKind = "buy" | "make" | "outsource";
export type UseKind = "use" | "stop";

export type Item = {
  code: string;
  name: string;
  shortName: string;
  engName: string;
  spec: string;
  asset: AssetKind;
  classL: string;
  classM: string;
  classS: string;
  stockUnit: string;
  buyUnit: string;
  sellUnit: string;
  tax: TaxKind;
  source: SourceKind;
  use: UseKind;
  supply: SupplyKind;
  vendor: string;
  buyPrice: string;
  minBuyQty: string;
  leadDays: string;
  inspect: boolean;
  sellPrice: string;
  shipWh: string;
  minSellQty: string;
  stockOn: boolean;
  lotOn: boolean;
  serialOn: boolean;
  safetyQty: string;
  homeWh: string;
  barcode: string;
};

export type ItemQuery = {
  code: string;
  name: string;
  spec: string;
  asset: AssetKind | "";
  use: UseKind | "";
};
