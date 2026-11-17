/** 자품목 정전개 표. */

import { supplyOptions } from "./labels";
import type { BomLine } from "./types";

/** 레벨, 소요량, 손실률이 있는 자품목 줄. */
export function BomLines({
  lines,
  picked,
  onPick,
  onChange,
}: {
  lines: BomLine[];
  picked: number | null;
  onPick: (index: number) => void;
  onChange: <K extends keyof BomLine>(index: number, key: K, value: BomLine[K]) => void;
}) {
  return (
    <div className="bom-lines">
      <table aria-label="자품목">
        {lines.length === 0 ? <caption>등록된 자품목이 없습니다.</caption> : null}
        <thead>
          <tr>
            <th>순번</th>
            <th>레벨</th>
            <th>자품번</th>
            <th>자품명</th>
            <th>규격</th>
            <th>소요량</th>
            <th>단위</th>
            <th>손실률</th>
            <th>조달구분</th>
            <th>투입공정</th>
            <th>위치</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => {
            return (
              <tr
                key={line.seq}
                className={picked === index ? "is-selected" : undefined}
                aria-selected={picked === index}
                onClick={() => onPick(index)}
              >
                <td>{line.seq}</td>
                <td>
                  <input
                    aria-label={`${line.seq}행 레벨`}
                    value={line.level}
                    onChange={(event) => onChange(index, "level", event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 자품번`}
                    value={line.code}
                    onChange={(event) => onChange(index, "code", event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 자품명`}
                    value={line.name}
                    onChange={(event) => onChange(index, "name", event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 규격`}
                    value={line.spec}
                    onChange={(event) => onChange(index, "spec", event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 소요량`}
                    value={line.qty}
                    onChange={(event) => onChange(index, "qty", event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 단위`}
                    value={line.unit}
                    onChange={(event) => onChange(index, "unit", event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 손실률`}
                    value={line.loss}
                    onChange={(event) => onChange(index, "loss", event.target.value)}
                  />
                </td>
                <td>
                  <select
                    aria-label={`${line.seq}행 조달구분`}
                    value={line.supply}
                    onChange={(event) => onChange(index, "supply", event.target.value as BomLine["supply"])}
                  >
                    {supplyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 투입공정`}
                    value={line.route}
                    onChange={(event) => onChange(index, "route", event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`${line.seq}행 위치`}
                    value={line.place}
                    onChange={(event) => onChange(index, "place", event.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
