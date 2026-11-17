/** 처방 화면의 빈 값과 샘플. */

import type { Recipe, RecipeLine, RecipeQuery } from "./types";

/** 성분 한 줄. */
export function blankLine(seq: number): RecipeLine {
  return { seq, code: "", name: "", spec: "", ratio: "", unit: "KG", tol: "", place: "" };
}

/** 신규 처방. */
export function blankRecipe(): Recipe {
  return {
    parent: "",
    parentName: "",
    version: "01",
    batch: "100",
    unit: "KG",
    from: "",
    to: "",
    use: "use",
    note: "",
    lines: [],
  };
}

/** 조회 조건 초기값. */
export function emptyQuery(): RecipeQuery {
  return { parent: "", parentName: "", use: "" };
}

function line(patch: Partial<RecipeLine> & Pick<RecipeLine, "seq" | "code" | "name" | "ratio">): RecipeLine {
  return { ...blankLine(patch.seq), ...patch };
}

/** 새로고침 때 되돌릴 샘플 3건. */
export function seedRecipes(): Recipe[] {
  return [
    {
      parent: "SF-PAD-01",
      parentName: "완충 패드",
      version: "01",
      batch: "100",
      unit: "KG",
      from: "2026-01-01",
      to: "",
      use: "use",
      note: "초도 배합",
      lines: [
        line({ seq: 1, code: "RM-KRFT-01", name: "크라프트지", spec: "180g", ratio: "92", unit: "KG", tol: "1", place: "혼합" }),
        line({ seq: 2, code: "RM-INK-01", name: "인쇄 잉크", spec: "1kg", ratio: "8", unit: "KG", tol: "0.5", place: "혼합" }),
      ],
    },
    {
      parent: "SF-PAD-01",
      parentName: "완충 패드",
      version: "02",
      batch: "100",
      unit: "KG",
      from: "2026-06-01",
      to: "",
      use: "use",
      note: "잉크 비율 변경",
      lines: [
        line({ seq: 1, code: "RM-KRFT-01", name: "크라프트지", spec: "180g", ratio: "90", unit: "KG", place: "혼합" }),
        line({ seq: 2, code: "RM-INK-01", name: "인쇄 잉크", spec: "1kg", ratio: "10", unit: "KG", place: "혼합" }),
      ],
    },
    {
      parent: "SF-COAT-01",
      parentName: "코팅액",
      version: "01",
      batch: "50",
      unit: "L",
      from: "2025-01-01",
      to: "2025-12-31",
      use: "stop",
      note: "단종",
      lines: [line({ seq: 1, code: "RM-INK-01", name: "인쇄 잉크", spec: "1kg", ratio: "100", unit: "L", place: "배합" })],
    },
  ];
}
