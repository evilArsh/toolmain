import { nanoid, customAlphabet } from "nanoid"
import rfdc from "rfdc"
import { AxiosError } from "axios"
import { serializeError } from "serialize-error"
import _merge from "lodash.merge"
import { isBoolean, isNumber, isString, isSymbol, isUndefined } from "./is"

/**
 * 使用 rfdc 默认配置深拷贝对象，函数不会被深拷贝
 */
export const cloneDeep = rfdc()
/**
 * 合并对象(`lodash.merge`)
 */
export const merge = _merge

export const NanoIdAlphabetFn = "_-123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/**
 * 生成基于`nanoid`的随机字符串
 */
export function uniqueId(): string {
  return uniqueNanoId()
}

/**
 * 生成基于`nanoid`的随机字符串
 *
 * @param length 字符串长度
 * @param alphaBet 自定义字符集
 */
export function uniqueNanoId(alphaBet?: string, length?: number): string {
  if (!alphaBet) return nanoid(length)
  return customAlphabet(alphaBet, length)()
}

/**
 * 生成基于`nanoid`的符合函数命名规则的字符串
 *
 * @param length 字符串长度
 */
export function uniqueNanoFnId(length: number): string {
  return uniqueNanoId(NanoIdAlphabetFn, length)
}

/**
 * 将任意错误对象转换为字符串
 */
export function errorToText(error: unknown): string {
  if (
    isNumber(error) ||
    isString(error) ||
    isBoolean(error) ||
    isSymbol(error) ||
    error === null ||
    error === undefined
  ) {
    return String(error)
  }
  if (error instanceof AxiosError) {
    return error.response?.data ? JSON.stringify(error.response?.data) : (error.message ?? error.response?.statusText)
  } else {
    if (error instanceof Error) {
      return error.message
    }
    return JSON.stringify(serializeError(error))
  }
}

/**
 * 将给定值加上`px`单位
 */
export function px(value?: string | number): string {
  if (!value) return "0"
  if (isString(value)) {
    const num = parseFloat(value)
    return isNumber(num) ? `${num}px` : "0"
  }
  return isNumber(value) ? `${value}px` : "0"
}

/**
 * 将给定值转为数字
 */
export function toNumber(value?: string | number): number {
  if (isUndefined(value)) return 0
  if (isNumber(value)) {
    return value
  } else {
    const num = parseFloat(value)
    return isNumber(num) ? num : 0
  }
}

/**
 * 将字符串组装为路径格式
 *
 * @param path 路径或路径数组
 * @param prefix 是否需要 `/` 前缀,`path`为 URL Scheme 时，会被忽略
 * @default true
 *
 * @param suffix 是否需要 `/` 前缀
 * @default false
 *
 * @example
 * ```js
 * resolvePath(["foo","bar"]) ==> "/foo/bar"
 * resolvePath("https://examples.com") ==> "https://examples.com"
 * ```
 */
export function resolvePath(path: string | string[], prefix: boolean = true, suffix: boolean = false): string {
  if (!path) return prefix || suffix ? "/" : ""
  if (path == "/") return prefix || suffix ? "/" : ""
  const doPrefix = (s: string, prefix?: boolean) =>
    s.startsWith("/") ? (prefix ? s : s.slice(1)) : prefix ? `/${s}` : s
  const doSuffix = (s: string, suffix?: boolean) =>
    s.endsWith("/") ? (suffix ? s : s.slice(0, -1)) : suffix ? `${s}/` : s
  let p = Array.isArray(path) ? path.join("/") : path
  p = p.replace(/\\+|\/+/g, "/")
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\//.test(p)) {
    return doSuffix(doPrefix(p.replace(/:\//g, "://"), false), suffix)
  }
  return doSuffix(doPrefix(p.replace(/\/+/g, "/"), prefix), suffix)
}

export * from "./response"
export * from "./index"
export * from "./is"
export * from "./resources"
export * from "./styles"
export * from "./time"
