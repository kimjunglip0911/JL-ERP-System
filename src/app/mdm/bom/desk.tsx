"use client";

/** BOM 조회와 등록 화면. */

import { useRef, useState } from "react";
import { BomForm } from "./form";
import { BomGrid } from "./grid";
import { kindOptions, useOptions } from "./labels";
import { BomLines } from "./lines";
import { filterBoms } from "./query";
import { addLine, copyBom, dropLine, patchBom, patchLine, removeBom, sameBom, saveBom } from "./rules";
import { blankBom, emptyQuery, seedBoms } from "./seed";
import { bomKey, type Bom, type BomQuery } from "./types";

type Mode = "new" | "edit";

type Desk = {
  boms: Bom[];
  query: BomQuery;
  applied: BomQuery;
  selected: string | null;
  draft: Bom;
  mode: Mode;
  line: number | null;
  message: string;
};

function openDesk(): Desk {
  const boms = seedBoms();
  const first = boms[0];
  return {
    boms,
    query: emptyQuery(),
    applied: emptyQuery(),
    selected: first ? bomKey(first) : null,
    draft: first ? copyBom(first) : blankBom(),
    mode: "edit",
    line: first && first.lines.length > 0 ? 0 : null,
    message: "",
  };
}

function isDirty(desk: Desk): boolean {
  if (desk.mode === "new") {
    return !sameBom(desk.draft, blankBom());
  }
  const saved = desk.boms.find((bom) => bomKey(bom) === desk.selected);
  if (!saved) {
    return !sameBom(desk.draft, blankBom());
  }
  return !sameBom(desk.draft, saved);
}

function lineOf(bom: Bom): number | null {
  return bom.lines.length > 0 ? 0 : null;
}

/** 세션 안에서 BOM을 조회하고 고친다. */
export function BomDesk() {
  const [desk, setDesk] = useState(openDesk);
  const deskRef = useRef(desk);
  deskRef.current = desk;
  const rows = filterBoms(desk.boms, desk.applied);

  function leaveOk(): boolean {
    if (!isDirty(deskRef.current)) {
      return true;
    }
    return window.confirm("저장하지 않은 내용이 있습니다. 이동할까요?");
  }

  function onSearch() {
    setDesk((prev) => {
      const found = filterBoms(prev.boms, prev.query);
      const stay = prev.selected !== null && found.some((row) => bomKey(row) === prev.selected);
      if (stay) {
        return { ...prev, applied: prev.query, message: "" };
      }
      const first = found[0];
      if (first) {
        return {
          ...prev,
          applied: prev.query,
          selected: bomKey(first),
          draft: copyBom(first),
          mode: "edit",
          line: lineOf(first),
          message: "",
        };
      }
      return {
        ...prev,
        applied: prev.query,
        mode: "edit",
        selected: null,
        draft: blankBom(),
        line: null,
        message: "조회된 BOM이 없습니다.",
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
      draft: blankBom(),
      line: null,
      message: "신규 BOM을 입력한 뒤 저장하세요.",
    }));
  }

  function onPick(key: string) {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => {
      const bom = prev.boms.find((row) => bomKey(row) === key);
      if (!bom) {
        return prev;
      }
      return { ...prev, selected: key, draft: copyBom(bom), mode: "edit", line: lineOf(bom), message: "" };
    });
  }

  function onSave() {
    setDesk((prev) => {
      const result = saveBom(prev.boms, prev.draft, prev.mode);
      if (result.error) {
        return { ...prev, message: result.error };
      }
      const saved = result.boms.find((bom) => bomKey(bom) === bomKey(prev.draft));
      return {
        ...prev,
        boms: result.boms,
        mode: "edit",
        selected: saved ? bomKey(saved) : null,
        draft: saved ? copyBom(saved) : prev.draft,
        line: saved ? lineOf(saved) : null,
        message: "저장했습니다.",
      };
    });
  }

  function onDelete() {
    const current = deskRef.current;
    if (current.mode === "new" || current.selected === null) {
      setDesk((prev) => ({ ...prev, message: "삭제할 BOM을 선택하세요." }));
      return;
    }
    if (!window.confirm("선택한 BOM을 삭제할까요?")) {
      return;
    }
    setDesk((prev) => {
      if (prev.selected === null) {
        return prev;
      }
      const boms = removeBom(prev.boms, prev.selected);
      const found = filterBoms(boms, prev.applied);
      const first = found[0];
      return {
        ...prev,
        boms,
        mode: "edit",
        selected: first ? bomKey(first) : null,
        draft: first ? copyBom(first) : blankBom(),
        line: first ? lineOf(first) : null,
        message: "삭제했습니다.",
      };
    });
  }

  function onAddLine() {
    setDesk((prev) => {
      const draft = addLine(prev.draft);
      return { ...prev, draft, line: draft.lines.length - 1, message: "" };
    });
  }

  function onDropLine() {
    const current = deskRef.current;
    if (current.line === null) {
      setDesk((prev) => ({ ...prev, message: "삭제할 자품목을 선택하세요." }));
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

  function onQuery<K extends keyof BomQuery>(key: K, value: BomQuery[K]) {
    setDesk((prev) => ({ ...prev, query: { ...prev.query, [key]: value } }));
  }

  return (
    <section className="bom-desk">
      <div className="bom-toolbar">
        <div className="bom-actions">
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
          <button type="button" onClick={onAddLine}>
            행추가
          </button>
          <button type="button" onClick={onDropLine}>
            행삭제
          </button>
        </div>
        <p className="bom-message" aria-live="polite">
          {desk.message}
        </p>
      </div>
      <form
        className="bom-query"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <label htmlFor="q-parent">
          모품번
          <input id="q-parent" value={desk.query.parent} onChange={(event) => onQuery("parent", event.target.value)} />
        </label>
        <label htmlFor="q-parent-name">
          모품명
          <input
            id="q-parent-name"
            value={desk.query.parentName}
            onChange={(event) => onQuery("parentName", event.target.value)}
          />
        </label>
        <label htmlFor="q-kind">
          BOM구분
          <select
            id="q-kind"
            value={desk.query.kind}
            onChange={(event) => onQuery("kind", event.target.value as BomQuery["kind"])}
          >
            <option value="">전체</option>
            {kindOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="q-use">
          사용여부
          <select id="q-use" value={desk.query.use} onChange={(event) => onQuery("use", event.target.value as BomQuery["use"])}>
            <option value="">전체</option>
            {useOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </form>
      <BomGrid rows={rows} selected={desk.mode === "edit" ? desk.selected : null} onPick={onPick} />
      <BomForm
        draft={desk.draft}
        mode={desk.mode}
        onChange={(key, value) => setDesk((prev) => ({ ...prev, draft: patchBom(prev.draft, key, value), message: "" }))}
      />
      <BomLines
        lines={desk.draft.lines}
        picked={desk.line}
        onPick={(line) => setDesk((prev) => ({ ...prev, line }))}
        onChange={(index, key, value) =>
          setDesk((prev) => ({
            ...prev,
            draft: patchLine(prev.draft, index, key, value),
            line: index,
            message: "",
          }))
        }
      />
    </section>
  );
}
