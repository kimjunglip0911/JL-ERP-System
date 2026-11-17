/** 품목 탭 입력. */

import { fieldsOf, tabOptions, type ItemTab } from "./labels";
import type { Item } from "./types";

/** 기본, 구매, 영업, 재고 탭. */
export function ItemForm({
  draft,
  mode,
  tab,
  onTab,
  onChange,
}: {
  draft: Item;
  mode: "new" | "edit";
  tab: ItemTab;
  onTab: (tab: ItemTab) => void;
  onChange: <K extends keyof Item>(key: K, value: Item[K]) => void;
}) {
  const fields = fieldsOf(tab);
  return (
    <>
      <div className="item-tabs" role="tablist" aria-label="품목 정보">
        {tabOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            id={`tab-${option.id}`}
            aria-selected={tab === option.id}
            aria-controls="item-panel"
            onClick={() => onTab(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="item-form" role="tabpanel" id="item-panel" aria-labelledby={`tab-${tab}`}>
        {fields.map((field) => {
          const id = `f-${field.key}`;
          if (field.kind === "check") {
            return (
              <label key={field.key} className="is-check" htmlFor={id}>
                <input
                  id={id}
                  type="checkbox"
                  checked={Boolean(draft[field.key])}
                  onChange={(event) => onChange(field.key, event.target.checked as Item[typeof field.key])}
                />
                {field.label}
              </label>
            );
          }
          if (field.kind === "select") {
            return (
              <label key={field.key} htmlFor={id}>
                {field.label}
                <select
                  id={id}
                  value={String(draft[field.key])}
                  onChange={(event) => onChange(field.key, event.target.value as Item[typeof field.key])}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }
          const locked = field.lockOnEdit === true && mode === "edit";
          return (
            <label key={field.key} htmlFor={id}>
              {field.label}
              <input
                id={id}
                value={String(draft[field.key])}
                disabled={locked}
                onChange={(event) => onChange(field.key, event.target.value as Item[typeof field.key])}
              />
            </label>
          );
        })}
      </div>
    </>
  );
}
