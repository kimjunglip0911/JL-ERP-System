/** 처방 화면의 한글 라벨. */

import type { UseKind } from "./types";

export const useOptions = [
  { value: "use", label: "사용" },
  { value: "stop", label: "중지" },
] as const satisfies readonly { value: UseKind; label: string }[];

/** 사용여부 한글 이름. */
export function useLabel(value: UseKind): string {
  const found = useOptions.find((option) => option.value === value);
  return found ? found.label : value;
}
