/** 처방 헤더 입력. */

import { useOptions } from "./labels";
import type { Recipe } from "./types";

/** 모품목, 버전, 기준배치. */
export function RecipeForm({
  draft,
  mode,
  onChange,
}: {
  draft: Recipe;
  mode: "new" | "edit";
  onChange: <K extends keyof Recipe>(key: K, value: Recipe[K]) => void;
}) {
  const locked = mode === "edit";
  return (
    <div className="recipe-form">
      <label htmlFor="r-parent">
        모품번
        <input id="r-parent" value={draft.parent} disabled={locked} onChange={(event) => onChange("parent", event.target.value)} />
      </label>
      <label htmlFor="r-name">
        모품명
        <input id="r-name" value={draft.parentName} onChange={(event) => onChange("parentName", event.target.value)} />
      </label>
      <label htmlFor="r-version">
        버전
        <input id="r-version" value={draft.version} disabled={locked} onChange={(event) => onChange("version", event.target.value)} />
      </label>
      <label htmlFor="r-batch">
        기준배치
        <input id="r-batch" value={draft.batch} onChange={(event) => onChange("batch", event.target.value)} />
      </label>
      <label htmlFor="r-unit">
        단위
        <input id="r-unit" value={draft.unit} onChange={(event) => onChange("unit", event.target.value)} />
      </label>
      <label htmlFor="r-from">
        적용시작
        <input id="r-from" value={draft.from} placeholder="YYYY-MM-DD" onChange={(event) => onChange("from", event.target.value)} />
      </label>
      <label htmlFor="r-to">
        적용종료
        <input id="r-to" value={draft.to} placeholder="YYYY-MM-DD" onChange={(event) => onChange("to", event.target.value)} />
      </label>
      <label htmlFor="r-use">
        사용여부
        <select id="r-use" value={draft.use} onChange={(event) => onChange("use", event.target.value as Recipe["use"])}>
          {useOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="is-wide" htmlFor="r-note">
        개정사유
        <input id="r-note" value={draft.note} onChange={(event) => onChange("note", event.target.value)} />
      </label>
    </div>
  );
}
