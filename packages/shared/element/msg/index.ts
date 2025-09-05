import {
  code1xx,
  code2xx,
  code3xx,
  code4xx,
  code5xx,
  errorToText,
  isArray,
  isBigInt,
  isBoolean,
  isString,
  isSymbol,
  isUndefined,
} from "@toolmain/shared"
import { ElMessage } from "element-plus"
import { Primitive } from "type-fest"

export type ElMessageType = "primary" | "success" | "warning" | "info" | "error"
export type ElMessage = {
  msg: string
  code?: number
  type?: ElMessageType
}

const msgMap: Record<ElMessageType, (txt: string) => void> = {
  primary: content => {
    ElMessage({ type: "primary", message: content })
  },
  success: content => {
    ElMessage({ type: "success", message: content })
  },
  warning: content => {
    ElMessage({ type: "warning", message: content })
  },
  info: content => {
    ElMessage({ type: "info", message: content })
  },
  error: content => {
    ElMessage({ type: "error", message: content })
  },
}

function codeToType(code: number): ElMessageType {
  if (code1xx(code)) {
    return "primary"
  } else if (code2xx(code)) {
    return "success"
  } else if (code3xx(code)) {
    return "info"
  } else if (code4xx(code)) {
    return "warning"
  } else if (code5xx(code)) {
    return "error"
  } else {
    return "primary"
  }
}

/**
 * element-plus 消息通知
 *
 * 消息内容为字符串时，默认为`primary`
 * ```plain
 * code类型:
 *  1xx     primary
 *  2xx     success
 *  3xx     info
 *  4xx     warning
 *  5xx|6xx error
 *  default primary
 * ```
 * @example
 * ```ts
 * msg({code:500,msg:"error"})
 * msg({code:200,msg:"success"})
 * msg({code:200,msg:"ok",type:"error"})
 * msg("ok")
 * msg("ok","primary")
 * ```
 * `type` 和 `code` 同时存在时,`type`优先
 */
export function msg(message: ElMessage | Primitive | Array<any> | Error, type?: ElMessageType): void {
  if (
    typeof message === "number" ||
    isString(message) ||
    isBoolean(message) ||
    isBigInt(message) ||
    isSymbol(message) ||
    isUndefined(message) ||
    message === null
  ) {
    return msg({ msg: String(message), code: 100, type })
  } else if (isArray(message)) {
    return msg({ msg: message.join(","), code: 100, type })
  } else if (message instanceof Error) {
    return msg({ msg: errorToText(message), code: 500, type })
  }
  if (message.msg) {
    if (message.type || type) {
      const m = msgMap[type ?? message.type ?? "primary"]
      if (m) return m(message.msg)
      return msg({ msg: message.msg, code: message.code })
    } else if (message.code) {
      return msgMap[codeToType(message.code)](message.msg)
    } else {
      return msgMap.primary(message.msg)
    }
  } else {
    return msg(JSON.stringify(message), type)
  }
}

/**
 * element-plus 消息通知，等价于：
 * ```js
 * msg(message, "primary")
 * ```
 */
export function msgPrimary(message: ElMessage | Primitive | Array<any> | Error): void {
  return msg(message, "primary")
}
/**
 * element-plus 消息通知，等价于：
 * ```js
 * msg(message, "success")
 * ```
 */
export function msgSuccess(message: ElMessage | Primitive | Array<any> | Error): void {
  return msg(message, "success")
}
/**
 * element-plus 消息通知，等价于：
 * ```js
 * msg(message, "warning")
 * ```
 */
export function msgWarning(message: ElMessage | Primitive | Array<any> | Error): void {
  return msg(message, "warning")
}
/**
 * element-plus 消息通知，等价于：
 * ```js
 * msg(message, "info")
 * ```
 */
export function msgInfo(message: ElMessage | Primitive | Array<any> | Error): void {
  return msg(message, "info")
}
/**
 * element-plus 消息通知，等价于：
 * ```js
 * msg(message, "error")
 * ```
 */
export function msgError(message: ElMessage | Primitive | Array<any> | Error): void {
  return msg(message, "error")
}
