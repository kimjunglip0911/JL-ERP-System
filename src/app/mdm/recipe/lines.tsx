/** 성분 배합비 표. */

import { mixQty, ratioSum } from "./rules";
import type { RecipeLine } from "./types";

/** 배합비와 배합량이 있는 성분 줄. */
export function RecipeLines({
  batch,
  lines,
  picked,
  onPick,
  onChange,
}: {
  batch: string;
  lines: RecipeLine[];
  picked: number | null;
  onPick: (index: number) => void;
  onChange: <K extends keyof RecipeLine>(index: number, key: K, value: RecipeLine[K]) => void;
}) {
  return (
    <div className="recipe-lines">
      <table aria-label="성분 배합비">
        {lines.length === 0 ? <caption>등록된 성분이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>순번</th>
            <th>성분코드</th>
            <th>성분명</th>
            <th>규격</th>
            <th>배합비</th>
            <th>배합량</th>
            <th>단위</th>
            <th>허용오차</th>
            <th>투입위치</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr
              key={line.seq}
              className={picked === index ? "is-selected" : undefined}
              aria-selected={picked === index}
              onClick={() => onPick(index)}
            >
              <td>{line.seq}</td>
              <td>
                <input aria-label={`${line.seq}행 성분코드`} value={line.code} onChange={(event) => onChange(index, "code", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${line.seq}행 성분명`} value={line.name} onChange={(event) => onChange(index, "name", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${line.seq}행 규격`} value={line.spec} onChange={(event) => onChange(index, "spec", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${line.seq}행 배합비`} value={line.ratio} onChange={(event) => onChange(index, "ratio", event.target.value)} />
              </td>
              <td>{mixQty(batch, line.ratio)}</td>
              <td>
                <input aria-label={`${line.seq}행 단위`} value={line.unit} onChange={(event) => onChange(index, "unit", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${line.seq}행 허용오차`} value={line.tol} onChange={(event) => onChange(index, "tol", event.target.value)} />
              </td>
              <td>
                <input aria-label={`${line.seq}행 투입위치`} value={line.place} onChange={(event) => onChange(index, "place", event.target.value)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="recipe-sum">배합비 합계 {ratioSum(lines)}</p>
    </div>
  );
}
