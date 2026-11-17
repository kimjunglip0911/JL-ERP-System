"use client";

/** 품목 조회와 등록 화면. */

import { useRef, useState } from "react";
import { ItemForm } from "./form";
import { ItemGrid } from "./grid";
import { assetOptions, useOptions, type ItemTab } from "./labels";
import { filterItems } from "./query";
import { patchItem, removeItem, sameItem, saveItem } from "./rules";
import { blankItem, emptyQuery, seedItems } from "./seed";
import type { Item, ItemQuery } from "./types";

type Mode = "new" | "edit";

type Desk = {
  items: Item[];
  query: ItemQuery;
  applied: ItemQuery;
  selected: string | null;
  draft: Item;
  mode: Mode;
  tab: ItemTab;
  message: string;
};

function openDesk(): Desk {
  const items = seedItems();
  const first = items[0];
  return {
    items,
    query: emptyQuery(),
    applied: emptyQuery(),
    selected: first ? first.code : null,
    draft: first ? { ...first } : blankItem(),
    mode: "edit",
    tab: "base",
    message: "",
  };
}

function isDirty(desk: Desk): boolean {
  if (desk.mode === "new") {
    return !sameItem(desk.draft, blankItem());
  }
  const saved = desk.items.find((item) => item.code === desk.selected);
  if (!saved) {
    return !sameItem(desk.draft, blankItem());
  }
  return !sameItem(desk.draft, saved);
}

/** 세션 안에서 품목을 조회하고 고친다. */
export function ItemDesk() {
  const [desk, setDesk] = useState(openDesk);
  const deskRef = useRef(desk);
  deskRef.current = desk;
  const rows = filterItems(desk.items, desk.applied);

  function leaveOk(): boolean {
    if (!isDirty(deskRef.current)) {
      return true;
    }
    return window.confirm("저장하지 않은 내용이 있습니다. 이동할까요?");
  }

  function onSearch() {
    setDesk((prev) => {
      const found = filterItems(prev.items, prev.query);
      const stay = prev.selected !== null && found.some((row) => row.code === prev.selected);
      if (stay) {
        return { ...prev, applied: prev.query, message: "" };
      }
      const first = found[0];
      if (first) {
        return {
          ...prev,
          applied: prev.query,
          selected: first.code,
          draft: { ...first },
          mode: "edit",
          message: "",
        };
      }
      return {
        ...prev,
        applied: prev.query,
        mode: "edit",
        selected: null,
        draft: blankItem(),
        message: "조회된 품목이 없습니다.",
      };
    });
  }

  function onNew() {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => ({
      ...prev,
      mode: "new",
      selected: null,
      draft: blankItem(),
      message: "신규 품목을 입력한 뒤 저장하세요.",
    }));
  }

  function onPick(code: string) {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => {
      const item = prev.items.find((row) => row.code === code);
      if (!item) {
        return prev;
      }
      return { ...prev, selected: code, draft: { ...item }, mode: "edit", message: "" };
    });
  }

  function onSave() {
    setDesk((prev) => {
      const result = saveItem(prev.items, prev.draft, prev.mode);
      if (result.error) {
        return { ...prev, message: result.error };
      }
      const code = prev.draft.code.trim();
      const saved = result.items.find((item) => item.code === code);
      return {
        ...prev,
        items: result.items,
        mode: "edit",
        selected: saved ? saved.code : code,
        draft: saved ? { ...saved } : prev.draft,
        message: "저장했습니다.",
      };
    });
  }

  function onDelete() {
    const current = deskRef.current;
    if (current.mode === "new" || current.selected === null) {
      setDesk((prev) => ({ ...prev, message: "삭제할 품목을 선택하세요." }));
      return;
    }
    if (!window.confirm("선택한 품목을 삭제할까요?")) {
      return;
    }
    setDesk((prev) => {
      if (prev.selected === null) {
        return prev;
      }
      const items = removeItem(prev.items, prev.selected);
      const found = filterItems(items, prev.applied);
      const first = found[0];
      return {
        ...prev,
        items,
        mode: "edit",
        selected: first ? first.code : null,
        draft: first ? { ...first } : blankItem(),
        message: "삭제했습니다.",
      };
    });
  }

  function onQuery<K extends keyof ItemQuery>(key: K, value: ItemQuery[K]) {
    setDesk((prev) => ({ ...prev, query: { ...prev.query, [key]: value } }));
  }

  return (
    <section className="item-desk">
      <div className="item-toolbar">
        <div className="item-actions">
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
        </div>
        <p className="item-message" aria-live="polite">
          {desk.message}
        </p>
      </div>
      <form
        className="item-query"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <label htmlFor="q-code">
          품번
          <input
            id="q-code"
            value={desk.query.code}
            onChange={(event) => onQuery("code", event.target.value)}
          />
        </label>
        <label htmlFor="q-name">
          품명
          <input
            id="q-name"
            value={desk.query.name}
            onChange={(event) => onQuery("name", event.target.value)}
          />
        </label>
        <label htmlFor="q-spec">
          규격
          <input
            id="q-spec"
            value={desk.query.spec}
            onChange={(event) => onQuery("spec", event.target.value)}
          />
        </label>
        <label htmlFor="q-asset">
          품목자산분류
          <select
            id="q-asset"
            value={desk.query.asset}
            onChange={(event) => onQuery("asset", event.target.value as ItemQuery["asset"])}
          >
            <option value="">전체</option>
            {assetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="q-use">
          사용여부
          <select
            id="q-use"
            value={desk.query.use}
            onChange={(event) => onQuery("use", event.target.value as ItemQuery["use"])}
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
      <ItemGrid rows={rows} selected={desk.selected} onPick={onPick} />
      <ItemForm
        draft={desk.draft}
        mode={desk.mode}
        tab={desk.tab}
        onTab={(tab) => setDesk((prev) => ({ ...prev, tab }))}
        onChange={(key, value) =>
          setDesk((prev) => ({ ...prev, draft: patchItem(prev.draft, key, value), message: "" }))
        }
      />
    </section>
  );
}
