/** 품목 목록. */

import { assetLabel, useLabel } from "./labels";
import type { Item } from "./types";

/** 조회 결과 표. */
export function ItemGrid({
  rows,
  selected,
  onPick,
}: {
  rows: Item[];
  selected: string | null;
  onPick: (code: string) => void;
}) {
  return (
    <div className="item-grid">
      <table aria-label="품목 목록">
        {rows.length === 0 ? <caption>조회된 품목이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>품번</th>
            <th>품명</th>
            <th>규격</th>
            <th>품목자산분류</th>
            <th>재고단위</th>
            <th>사용여부</th>
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
                <td>{row.spec}</td>
                <td>{assetLabel(row.asset)}</td>
                <td>{row.stockUnit}</td>
                <td className={row.use === "stop" ? "is-stop" : undefined}>{useLabel(row.use)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
