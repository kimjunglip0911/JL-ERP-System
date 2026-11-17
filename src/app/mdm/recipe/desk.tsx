"use client";

/** 제조 처방 조회와 등록 화면. */

import { useRef, useState } from "react";
import { RecipeForm } from "./form";
import { RecipeGrid } from "./grid";
import { useOptions } from "./labels";
import { RecipeLines } from "./lines";
import { filterRecipes } from "./query";
import { addLine, copyRecipe, dropLine, patchLine, patchRecipe, removeRecipe, sameRecipe, saveRecipe } from "./rules";
import { blankRecipe, emptyQuery, seedRecipes } from "./seed";
import { recipeKey, type RecipeQuery } from "./types";

type Mode = "new" | "edit";

type Desk = {
  recipes: ReturnType<typeof seedRecipes>;
  query: RecipeQuery;
  applied: RecipeQuery;
  selected: string | null;
  draft: ReturnType<typeof blankRecipe>;
  mode: Mode;
  line: number | null;
  message: string;
};

function openDesk(): Desk {
  const recipes = seedRecipes();
  const first = recipes[0];
  return {
    recipes,
    query: emptyQuery(),
    applied: emptyQuery(),
    selected: first ? recipeKey(first) : null,
    draft: first ? copyRecipe(first) : blankRecipe(),
    mode: "edit",
    line: first && first.lines.length > 0 ? 0 : null,
    message: "",
  };
}

function lineOf(recipe: ReturnType<typeof blankRecipe>): number | null {
  return recipe.lines.length > 0 ? 0 : null;
}

function isDirty(desk: Desk): boolean {
  if (desk.mode === "new") {
    return !sameRecipe(desk.draft, blankRecipe());
  }
  const saved = desk.recipes.find((recipe) => recipeKey(recipe) === desk.selected);
  return !sameRecipe(desk.draft, saved ?? blankRecipe());
}

/** 세션 안에서 처방을 조회하고 고친다. */
export function RecipeDesk() {
  const [desk, setDesk] = useState(openDesk);
  const deskRef = useRef(desk);
  deskRef.current = desk;
  const rows = filterRecipes(desk.recipes, desk.applied);

  function leaveOk(): boolean {
    if (!isDirty(deskRef.current)) {
      return true;
    }
    return window.confirm("저장하지 않은 내용이 있습니다. 이동할까요?");
  }

  function onSearch() {
    setDesk((prev) => {
      const found = filterRecipes(prev.recipes, prev.query);
      const stay = prev.selected !== null && found.some((row) => recipeKey(row) === prev.selected);
      if (stay) {
        return { ...prev, applied: prev.query, message: "" };
      }
      const first = found[0];
      if (first) {
        return { ...prev, applied: prev.query, selected: recipeKey(first), draft: copyRecipe(first), mode: "edit", line: lineOf(first), message: "" };
      }
      return { ...prev, applied: prev.query, mode: "edit", selected: null, draft: blankRecipe(), line: null, message: "조회된 처방이 없습니다." };
    });
  }

  function onNew() {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => ({ ...prev, mode: "new", selected: null, draft: blankRecipe(), line: null, message: "신규 처방을 입력한 뒤 저장하세요." }));
  }

  function onPick(key: string) {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => {
      const recipe = prev.recipes.find((row) => recipeKey(row) === key);
      if (!recipe) {
        return prev;
      }
      return { ...prev, selected: key, draft: copyRecipe(recipe), mode: "edit", line: lineOf(recipe), message: "" };
    });
  }

  function onSave() {
    setDesk((prev) => {
      const result = saveRecipe(prev.recipes, prev.draft, prev.mode);
      if (result.error) {
        return { ...prev, message: result.error };
      }
      const saved = result.recipes.find((recipe) => recipeKey(recipe) === recipeKey(prev.draft));
      return {
        ...prev,
        recipes: result.recipes,
        mode: "edit",
        selected: saved ? recipeKey(saved) : null,
        draft: saved ? copyRecipe(saved) : prev.draft,
        line: saved ? lineOf(saved) : null,
        message: "저장했습니다.",
      };
    });
  }

  function onDelete() {
    const current = deskRef.current;
    if (current.mode === "new" || current.selected === null) {
      setDesk((prev) => ({ ...prev, message: "삭제할 처방을 선택하세요." }));
      return;
    }
    if (!window.confirm("선택한 처방을 삭제할까요?")) {
      return;
    }
    setDesk((prev) => {
      if (prev.selected === null) {
        return prev;
      }
      const recipes = removeRecipe(prev.recipes, prev.selected);
      const found = filterRecipes(recipes, prev.applied);
      const first = found[0];
      return {
        ...prev,
        recipes,
        mode: "edit",
        selected: first ? recipeKey(first) : null,
        draft: first ? copyRecipe(first) : blankRecipe(),
        line: first ? lineOf(first) : null,
        message: "삭제했습니다.",
      };
    });
  }

  function onAdd() {
    setDesk((prev) => {
      const draft = addLine(prev.draft);
      return { ...prev, draft, line: draft.lines.length - 1, message: "" };
    });
  }

  function onDrop() {
    if (deskRef.current.line === null) {
      setDesk((prev) => ({ ...prev, message: "삭제할 성분을 선택하세요." }));
      return;
    }
    setDesk((prev) => {
      if (prev.line === null) {
        return prev;
      }
      const draft = dropLine(prev.draft, prev.line);
      const line = draft.lines.length === 0 ? null : Math.min(prev.line, draft.lines.length - 1);
      return { ...prev, draft, line, message: "" };
    });
  }

  return (
    <section className="recipe-desk">
      <div className="recipe-toolbar">
        <div className="recipe-actions">
          <button type="button" className="is-primary" onClick={onSearch}>
            조회
          </button>
          <button type="button" onClick={onNew}>
            신규
          </button>
          <button type="button" className="is-primary" onClick={onSave}>
            저장
          </button>
          <button type="button" onClick={onDelete}>
            삭제
          </button>
          <button type="button" onClick={onAdd}>
            행추가
          </button>
          <button type="button" onClick={onDrop}>
            행삭제
          </button>
        </div>
        <p className="recipe-message" aria-live="polite">
          {desk.message}
        </p>
      </div>
      <form
        className="recipe-query"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <label htmlFor="q-parent">
          모품번
          <input id="q-parent" value={desk.query.parent} onChange={(event) => setDesk((prev) => ({ ...prev, query: { ...prev.query, parent: event.target.value } }))} />
        </label>
        <label htmlFor="q-name">
          모품명
          <input
            id="q-name"
            value={desk.query.parentName}
            onChange={(event) => setDesk((prev) => ({ ...prev, query: { ...prev.query, parentName: event.target.value } }))}
          />
        </label>
        <label htmlFor="q-use">
          사용여부
          <select
            id="q-use"
            value={desk.query.use}
            onChange={(event) => setDesk((prev) => ({ ...prev, query: { ...prev.query, use: event.target.value as RecipeQuery["use"] } }))}
          >
            <option value="">전체</option>
            {useOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </form>
      <RecipeGrid rows={rows} selected={desk.mode === "edit" ? desk.selected : null} onPick={onPick} />
      <RecipeForm
        draft={desk.draft}
        mode={desk.mode}
        onChange={(key, value) => setDesk((prev) => ({ ...prev, draft: patchRecipe(prev.draft, key, value), message: "" }))}
      />
      <RecipeLines
        batch={desk.draft.batch}
        lines={desk.draft.lines}
        picked={desk.line}
        onPick={(line) => setDesk((prev) => ({ ...prev, line }))}
        onChange={(index, key, value) => setDesk((prev) => ({ ...prev, draft: patchLine(prev.draft, index, key, value), line: index, message: "" }))}
      />
    </section>
  );
}
