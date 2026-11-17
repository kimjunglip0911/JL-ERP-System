/** BOM 화면의 빈 값과 샘플. */

import type { Bom, BomLine, BomQuery } from "./types";

/** 자품목 한 줄. */
export function blankLine(seq: number): BomLine {
  return {
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
}

/** 신규 BOM. */
export function blankBom(): Bom {
  return {
    parent: "",
    parentName: "",
    spec: "",
    unit: "EA",
    kind: "prod",
    version: "01",
    baseQty: "1",
    from: "",
    to: "",
    use: "use",
    note: "",
    lines: [],
  };
}

/** 조회 조건 초기값. */
export function emptyQuery(): BomQuery {
  return { parent: "", parentName: "", kind: "", use: "" };
}

function line(patch: Partial<BomLine> & Pick<BomLine, "seq" | "code" | "name" | "qty">): BomLine {
  return { ...blankLine(patch.seq), ...patch };
}

function bom(patch: Partial<Bom> & Pick<Bom, "parent" | "parentName" | "version">): Bom {
  return { ...blankBom(), ...patch, lines: patch.lines ?? [] };
}

/** 새로고침 때 되돌릴 샘플. */
export function seedBoms(): Bom[] {
  return [
    bom({
      parent: "FG-BOX-01",
      parentName: "골판지 박스 A형",
      spec: "400x300x200",
      kind: "prod",
      version: "01",
      baseQty: "1",
      from: "2026-01-01",
      note: "초도 양산",
      lines: [
        line({ seq: 1, level: "1", code: "SF-PAD-01", name: "완충 패드", spec: "10T", qty: "2", unit: "EA", loss: "1", supply: "make", route: "조립", place: "PAD" }),
        line({ seq: 2, level: "1", code: "RM-KRFT-01", name: "크라프트지", spec: "180g", qty: "0.35", unit: "KG", loss: "3", supply: "buy", route: "재단", place: "SHEET" }),
        line({ seq: 3, level: "2", code: "SM-TAPE-01", name: "OPP 테이프", spec: "48mm", qty: "1", unit: "EA", loss: "0", supply: "buy", route: "포장", place: "TAPE" }),
      ],
    }),
    bom({
      parent: "FG-BOX-01",
      parentName: "골판지 박스 A형",
      spec: "400x300x200",
      kind: "prod",
      version: "02",
      baseQty: "1",
      from: "2026-06-01",
      note: "패드 수량을 1로 변경",
      lines: [
        line({ seq: 1, level: "1", code: "SF-PAD-01", name: "완충 패드", spec: "10T", qty: "1", unit: "EA", loss: "1", supply: "make", route: "조립", place: "PAD" }),
        line({ seq: 2, level: "1", code: "RM-KRFT-01", name: "크라프트지", spec: "180g", qty: "0.35", unit: "KG", loss: "3", supply: "buy", route: "재단", place: "SHEET" }),
      ],
    }),
    bom({
      parent: "FG-BOX-01",
      parentName: "골판지 박스 A형",
      spec: "400x300x200",
      kind: "design",
      version: "01",
      baseQty: "1",
      from: "2026-03-01",
      note: "설계 초안",
      lines: [
        line({ seq: 1, level: "1", code: "SF-PAD-01", name: "완충 패드", spec: "10T", qty: "2", unit: "EA", supply: "make", route: "조립", place: "PAD" }),
      ],
    }),
    bom({
      parent: "SF-PAD-01",
      parentName: "완충 패드",
      spec: "10T",
      kind: "prod",
      version: "01",
      baseQty: "1",
      from: "2026-01-01",
      note: "반제품 전개",
      lines: [
        line({ seq: 1, level: "1", code: "RM-KRFT-01", name: "크라프트지", spec: "180g", qty: "0.08", unit: "KG", loss: "2", supply: "buy", route: "재단", place: "SHEET" }),
      ],
    }),
    bom({
      parent: "FG-PLT-01",
      parentName: "목재 팔레트",
      spec: "1100x1100",
      kind: "prod",
      version: "01",
      baseQty: "1",
      from: "2025-01-01",
      to: "2025-12-31",
      use: "stop",
      note: "단종",
      lines: [
        line({ seq: 1, level: "1", code: "RM-WOOD-01", name: "각재", spec: "90x90", qty: "6", unit: "EA", supply: "buy", route: "조립", place: "BEAM" }),
      ],
    }),
  ];
}
