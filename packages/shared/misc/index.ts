import { nanoid, customAlphabet } from "nanoid"
import rfdc from "rfdc"
import { AxiosError } from "axios"
import { serializeError } from "serialize-error"
import _merge from "lodash.merge"
import { isNumber, isString, isUndefined } from "../is"

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
  if (isNumber(error) || isString(error)) {
    return String(error)
  }
  if (error instanceof AxiosError) {
    return JSON.stringify(error.response?.data) ?? error.message
  } else {
    if (error instanceof Error && error.message) {
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
    return !isNaN(num) ? `${num}px` : value
  }
  return `${value}px`
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
    return isNaN(num) ? 0 : num
  }
}

/**
 * 将字符串组装为路径格式
 *
 * @param path 路径或路径数组
 * @param withPrefix 是否需要 `/` 前缀
 * @default true
 *
 * @param withSuffix 是否需要 `/` 前缀
 * @default false
 *
 * @example eg: ["foo","bar"] ==> "foo/bar"
 */
export function resolvePath(path: string | string[], withPrefix: boolean = true, withSuffix: boolean = false): string {
  let p = Array.isArray(path) ? path.join("/") : path
  if (/^[a-zA-Z]+:\/\//.test(p)) {
    return p.replace(/(?<!:\/)\/+/g, "/")
  }
  p = p.replace(/\/+/g, "/")
  p = p === "/" ? p : p.endsWith("/") && !withSuffix ? p.slice(0, -1) : p
  if (withPrefix) {
    p = p.startsWith("/") ? p : `/${p}`
  } else {
    p = p.startsWith("/") ? p.slice(1) : p
  }
  return p
}
