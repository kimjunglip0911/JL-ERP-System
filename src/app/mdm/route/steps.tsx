/** 공정 순서 표. */

import type { RouteStep, Wc } from "./types";

/** 준비시간과 작업시간이 있는 공정 줄. */
export function StepGrid({
  steps,
  wcs,
  picked,
  onPick,
  onChange,
}: {
  steps: RouteStep[];
  wcs: Wc[];
  picked: number | null;
  onPick: (index: number) => void;
  onChange: <K extends keyof RouteStep>(index: number, key: K, value: RouteStep[K]) => void;
}) {
  const codes = new Set(wcs.map((wc) => wc.code));
  return (
    <div className="route-steps">
      <table aria-label="공정 순서">
        {steps.length === 0 ? <caption>등록된 공정이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>순번</th>
            <th>공정코드</th>
            <th>공정명</th>
            <th>작업장</th>
            <th>준비시간</th>
            <th>작업시간</th>
            <th>표준인원</th>
            <th>외주</th>
            <th>검사</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step, index) => (
            <tr
              key={step.seq}
              className={picked === index ? "is-selected" : undefined}
              aria-selected={picked === index}
              onClick={() => onPick(index)}
            >
              <td>{step.seq}</td>
              <td>
                <input aria-label={`${step.seq}행 공정코드`} value={step.code} onChange={(event) => onChange(index, "code", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${step.seq}행 공정명`} value={step.name} onChange={(event) => onChange(index, "name", event.target.value)} />
              </td>
              <td>
                <select aria-label={`${step.seq}행 작업장`} value={step.wc} onChange={(event) => onChange(index, "wc", event.target.value)}>
                  <option value="">선택</option>
                  {!codes.has(step.wc) && step.wc ? <option value={step.wc}>{step.wc}</option> : null}
                  {wcs.map((wc) => (
                    <option key={wc.code} value={wc.code}>
                      {wc.code} {wc.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input aria-label={`${step.seq}행 준비시간`} value={step.setup} onChange={(event) => onChange(index, "setup", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${step.seq}행 작업시간`} value={step.run} onChange={(event) => onChange(index, "run", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${step.seq}행 표준인원`} value={step.crew} onChange={(event) => onChange(index, "crew", event.target.value)} />
              </td>
              <td>
                <input
                  aria-label={`${step.seq}행 외주`}
                  type="checkbox"
                  checked={step.outside}
                  onChange={(event) => onChange(index, "outside", event.target.checked)}
                />
              </td>
              <td>
                <input
                  aria-label={`${step.seq}행 검사`}
                  type="checkbox"
                  checked={step.inspect}
                  onChange={(event) => onChange(index, "inspect", event.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
