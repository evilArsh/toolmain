export enum z {
  ABSOLUTE = 100,
  ABSOLUTE_CONFIG = 110,
  ABSOLUTE_TOP = 198,
  ABSOLUTE_MAX = 199,

  FIXED = 200,
  FIXED_CONFIG = 210,
  FIXED_TOP = 298,
  FIXED_MAX = 299,

  MAX = 999,
  MAX2 = 1000,
  HIDDEN = -999,
}
export type ArrMutKeys = "splice" | "push" | "pop" | "shift" | "unshift"
/**
 * 定长数组类型
 */
export type FixedArray<T, L extends number> = Pick<T[], Exclude<keyof T[], ArrMutKeys>> & {
  readonly length: L
}

export interface CallBack {
  callback: (...arg: any[]) => void
}
/**
 * 回调函数类型
 */
export type CallBackFn = (...arg: any[]) => void
/**
 * 异步回调函数类型
 */
export type AsyncCallBackFn = (...arg: any[]) => Promise<void>
