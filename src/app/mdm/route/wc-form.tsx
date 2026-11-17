/** 작업장 입력. */

import { kindOptions, useOptions } from "./labels";
import type { Wc } from "./types";

/** 작업장 코드, 능력, 사용여부. */
export function WcForm({
  draft,
  mode,
  onChange,
}: {
  draft: Wc;
  mode: "new" | "edit";
  onChange: <K extends keyof Wc>(key: K, value: Wc[K]) => void;
}) {
  return (
    <div className="route-form">
      <label htmlFor="w-code">
        작업장코드
        <input id="w-code" value={draft.code} disabled={mode === "edit"} onChange={(event) => onChange("code", event.target.value)} />
      </label>
      <label htmlFor="w-name">
        작업장명
        <input id="w-name" value={draft.name} onChange={(event) => onChange("name", event.target.value)} />
      </label>
      <label htmlFor="w-kind">
        작업장구분
        <select id="w-kind" value={draft.kind} onChange={(event) => onChange("kind", event.target.value as Wc["kind"])}>
          {kindOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="w-plant">
        공장
        <input id="w-plant" value={draft.plant} onChange={(event) => onChange("plant", event.target.value)} />
      </label>
      <label htmlFor="w-hours">
        일가동시간
        <input id="w-hours" value={draft.hours} onChange={(event) => onChange("hours", event.target.value)} />
      </label>
      <label htmlFor="w-crew">
        가동인원
        <input id="w-crew" value={draft.crew} onChange={(event) => onChange("crew", event.target.value)} />
      </label>
      <label htmlFor="w-machines">
        설비대수
        <input id="w-machines" value={draft.machines} onChange={(event) => onChange("machines", event.target.value)} />
      </label>
      <label htmlFor="w-use">
        사용여부
        <select id="w-use" value={draft.use} onChange={(event) => onChange("use", event.target.value as Wc["use"])}>
          {useOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
