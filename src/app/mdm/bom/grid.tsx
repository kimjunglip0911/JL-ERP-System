/** BOM 헤더 목록. */

import { kindLabel, useLabel } from "./labels";
import { bomKey, type Bom } from "./types";

/** 조회된 BOM 표. */
export function BomGrid({
  rows,
  selected,
  onPick,
}: {
  rows: Bom[];
  selected: string | null;
  onPick: (key: string) => void;
}) {
  return (
    <div className="bom-grid">
      <table aria-label="BOM 목록">
        {rows.length === 0 ? <caption>조회된 BOM이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>모품번</th>
            <th>모품명</th>
            <th>규격</th>
            <th>BOM구분</th>
            <th>버전</th>
            <th>기준수량</th>
            <th>적용시작</th>
            <th>사용</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = bomKey(row);
            const current = selected === key;
            return (
              <tr
                key={key}
                className={current ? "is-selected" : undefined}
                aria-selected={current}
                tabIndex={0}
                onClick={() => onPick(key)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onPick(key);
                  }
                }}
              >
                <td>{row.parent}</td>
                <td>{row.parentName}</td>
                <td>{row.spec}</td>
                <td>{kindLabel(row.kind)}</td>
                <td>{row.version}</td>
                <td>{row.baseQty}</td>
                <td>{row.from}</td>
                <td className={row.use === "stop" ? "is-stop" : undefined}>{useLabel(row.use)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
