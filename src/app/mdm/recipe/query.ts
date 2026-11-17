/** 처방 조회 조건. */

import type { Recipe, RecipeQuery } from "./types";

function matches(value: string, needle: string): boolean {
  const text = needle.trim().toLowerCase();
  if (!text) {
    return true;
  }
  return value.toLowerCase().includes(text);
}

/** 조회 버튼을 누른 조건으로 처방을 거른다. */
export function filterRecipes(recipes: Recipe[], query: RecipeQuery): Recipe[] {
  return recipes.filter((recipe) => {
    if (!matches(recipe.parent, query.parent)) {
      return false;
    }
    if (!matches(recipe.parentName, query.parentName)) {
      return false;
    }
    if (query.use && recipe.use !== query.use) {
      return false;
    }
    return true;
  });
}
