import { HttpStatusCode, StatusResponse, Response } from "../types"

/**
 * 将数据组装成以下格式:
 * ```js
 * {
 *  code: HttpStatusCode,
 *  msg: string,
 * }
 * ```
 */
export function responseCode(code: HttpStatusCode, msg?: string): StatusResponse {
  return {
    code,
    msg: msg ?? "",
    data: undefined,
  }
}
/**
 * 将数据组装成以下格式:
 * ```js
 * {
 *  code: HttpStatusCode,
 *  msg: string,
 *  data: T
 * }
 * ```
 */
export function responseData<T>(code: HttpStatusCode, msg: string, data: T): Response<T> {
  return { code, msg, data }
}
/**
 * 判断`code` 是否处于 [100,200) 区间
 */
export function code1xx(code: HttpStatusCode | number) {
  return code >= 100 && code < 200
}
/**
 * 判断`code` 是否处于 [200,300) 区间
 */
export function code2xx(code: HttpStatusCode | number) {
  return code >= 200 && code < 300
}
/**
 * 判断`code` 是否处于 [300,400) 区间
 */
export function code3xx(code: HttpStatusCode | number) {
  return code >= 300 && code < 400
}
/**
 * 判断`code` 是否处于 [400,500) 区间
 */
export function code4xx(code: HttpStatusCode | number) {
  return code >= 400 && code < 500
}
/**
 * 判断`code` 是否处于 [500,511] 区间
 */
export function code5xx(code: HttpStatusCode | number) {
  return code >= 500 && code <= 511
}
