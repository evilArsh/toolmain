import { HttpStatusCode, BridgeStatusResponse, BridgeResponse } from "../types"

export function responseCode(code: HttpStatusCode, msg?: string): BridgeStatusResponse {
  return {
    code,
    msg: msg ?? "",
    data: undefined,
  }
}
export function responseData<T>(code: HttpStatusCode, msg: string, data: T): BridgeResponse<T> {
  return { code, msg, data }
}
/**
 * code => [100,200)
 */
export function code1xx(code: HttpStatusCode | number) {
  return code >= 100 && code < 200
}
/**
 * code => [200,300)
 */
export function code2xx(code: HttpStatusCode | number) {
  return code >= 200 && code < 300
}
/**
 * code => [300,400)
 */
export function code3xx(code: HttpStatusCode | number) {
  return code >= 300 && code < 400
}
/**
 * code => [400,500)
 */
export function code4xx(code: HttpStatusCode | number) {
  return code >= 400 && code < 500
}
/**
 * code => [500,511]
 */
export function code5xx(code: HttpStatusCode | number) {
  return code >= 500 && code <= 511
}
