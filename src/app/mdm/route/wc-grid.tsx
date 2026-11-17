/** 작업장 목록. */

import { kindLabel, useLabel } from "./labels";
import { capHours, type Wc } from "./types";

/** 조회된 작업장 표. */
export function WcGrid({
  rows,
  selected,
  onPick,
}: {
  rows: Wc[];
  selected: string | null;
  onPick: (code: string) => void;
}) {
  return (
    <div className="route-grid">
      <table aria-label="작업장 목록">
        {rows.length === 0 ? <caption>조회된 작업장이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>작업장코드</th>
            <th>작업장명</th>
            <th>구분</th>
            <th>공장</th>
            <th>일가동시간</th>
            <th>가동인원</th>
            <th>설비대수</th>
            <th>생산능력</th>
            <th>사용</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const current = selected === row.code;
            return (
              <tr
                key={row.code}
                className={current ? "is-selected" : undefined}
                aria-selected={current}
                tabIndex={0}
                onClick={() => onPick(row.code)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onPick(row.code);
                  }
                }}
              >
                <td>{row.code}</td>
                <td>{row.name}</td>
                <td>{kindLabel(row.kind)}</td>
                <td>{row.plant}</td>
                <td>{row.hours}</td>
                <td>{row.crew}</td>
                <td>{row.machines}</td>
                <td>{capHours(row)}</td>
                <td className={row.use === "stop" ? "is-stop" : undefined}>{useLabel(row.use)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
