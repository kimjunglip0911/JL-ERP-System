/** BOM 헤더 입력. */

import { kindOptions, useOptions } from "./labels";
import type { Bom } from "./types";

/** 모품목, 버전, 적용 기간. */
export function BomForm({
  draft,
  mode,
  onChange,
}: {
  draft: Bom;
  mode: "new" | "edit";
  onChange: <K extends keyof Bom>(key: K, value: Bom[K]) => void;
}) {
  const locked = mode === "edit";
  return (
    <div className="bom-form">
      <label htmlFor="b-parent">
        모품번
        <input
          id="b-parent"
          value={draft.parent}
          disabled={locked}
          onChange={(event) => onChange("parent", event.target.value)}
        />
      </label>
      <label htmlFor="b-name">
        모품명
        <input id="b-name" value={draft.parentName} onChange={(event) => onChange("parentName", event.target.value)} />
      </label>
      <label htmlFor="b-spec">
        규격
        <input id="b-spec" value={draft.spec} onChange={(event) => onChange("spec", event.target.value)} />
      </label>
      <label htmlFor="b-unit">
        단위
        <input id="b-unit" value={draft.unit} onChange={(event) => onChange("unit", event.target.value)} />
      </label>
      <label htmlFor="b-kind">
        BOM구분
        <select
          id="b-kind"
          value={draft.kind}
          disabled={locked}
          onChange={(event) => onChange("kind", event.target.value as Bom["kind"])}
        >
          {kindOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="b-version">
        버전
        <input
          id="b-version"
          value={draft.version}
          disabled={locked}
          onChange={(event) => onChange("version", event.target.value)}
        />
      </label>
      <label htmlFor="b-base">
        기준수량
        <input id="b-base" value={draft.baseQty} onChange={(event) => onChange("baseQty", event.target.value)} />
      </label>
      <label htmlFor="b-from">
        적용시작
        <input id="b-from" value={draft.from} placeholder="YYYY-MM-DD" onChange={(event) => onChange("from", event.target.value)} />
      </label>
      <label htmlFor="b-to">
        적용종료
        <input id="b-to" value={draft.to} placeholder="YYYY-MM-DD" onChange={(event) => onChange("to", event.target.value)} />
      </label>
      <label htmlFor="b-use">
        사용여부
        <select id="b-use" value={draft.use} onChange={(event) => onChange("use", event.target.value as Bom["use"])}>
          {useOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="is-wide" htmlFor="b-note">
        개정사유
        <input id="b-note" value={draft.note} onChange={(event) => onChange("note", event.target.value)} />
      </label>
    </div>
  );
}
