/** 공정 화면의 한글 라벨. */

import type { UseKind, WcKind } from "./types";

type Option<T extends string> = { value: T; label: string };

export const kindOptions = [
  { value: "in", label: "사내" },
  { value: "out", label: "외주" },
] as const satisfies readonly Option<WcKind>[];

export const useOptions = [
  { value: "use", label: "사용" },
  { value: "stop", label: "중지" },
] as const satisfies readonly Option<UseKind>[];

/** 작업장구분 한글 이름. */
export function kindLabel(value: WcKind): string {
  const found = kindOptions.find((option) => option.value === value);
  return found ? found.label : value;
}

/** 사용여부 한글 이름. */
export function useLabel(value: UseKind): string {
  const found = useOptions.find((option) => option.value === value);
  return found ? found.label : value;
}
