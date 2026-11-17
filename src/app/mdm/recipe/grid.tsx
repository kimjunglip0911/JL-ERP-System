/** 처방 목록. */

import { useLabel } from "./labels";
import { recipeKey, type Recipe } from "./types";

/** 조회된 처방 표. */
export function RecipeGrid({
  rows,
  selected,
  onPick,
}: {
  rows: Recipe[];
  selected: string | null;
  onPick: (key: string) => void;
}) {
  return (
    <div className="recipe-grid">
      <table aria-label="처방 목록">
        {rows.length === 0 ? <caption>조회된 처방이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>모품번</th>
            <th>모품명</th>
            <th>버전</th>
            <th>기준배치</th>
            <th>단위</th>
            <th>적용시작</th>
            <th>사용</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = recipeKey(row);
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
                <td>{row.version}</td>
                <td>{row.batch}</td>
                <td>{row.unit}</td>
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
