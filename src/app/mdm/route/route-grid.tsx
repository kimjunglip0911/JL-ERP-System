/** 품목 공정 목록. */

import { useLabel } from "./labels";
import type { Route } from "./types";

/** 조회된 공정 표. */
export function RouteGrid({
  rows,
  selected,
  onPick,
}: {
  rows: Route[];
  selected: string | null;
  onPick: (parent: string) => void;
}) {
  return (
    <div className="route-grid">
      <table aria-label="공정 목록">
        {rows.length === 0 ? <caption>조회된 공정이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>모품번</th>
            <th>모품명</th>
            <th>공정 수</th>
            <th>사용</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const current = selected === row.parent;
            return (
              <tr
                key={row.parent}
                className={current ? "is-selected" : undefined}
                aria-selected={current}
                tabIndex={0}
                onClick={() => onPick(row.parent)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onPick(row.parent);
                  }
                }}
              >
                <td>{row.parent}</td>
                <td>{row.parentName}</td>
                <td>{row.steps.length}</td>
                <td className={row.use === "stop" ? "is-stop" : undefined}>{useLabel(row.use)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
