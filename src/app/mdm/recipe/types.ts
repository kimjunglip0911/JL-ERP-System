/** 제조 처방과 성분 줄. */

export type UseKind = "use" | "stop";

export type RecipeLine = {
  seq: number;
  code: string;
  name: string;
  spec: string;
  ratio: string;
  unit: string;
  tol: string;
  place: string;
};

export type Recipe = {
  parent: string;
  parentName: string;
  version: string;
  batch: string;
  unit: string;
  from: string;
  to: string;
  use: UseKind;
  note: string;
  lines: RecipeLine[];
};

export type RecipeQuery = {
  parent: string;
  parentName: string;
  use: UseKind | "";
};

/** 모품번과 버전으로 처방을 가른다. */
export function recipeKey(recipe: Pick<Recipe, "parent" | "version">): string {
  return `${recipe.parent.trim()}|${recipe.version.trim()}`;
}
