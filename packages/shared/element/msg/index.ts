import { code1xx, code2xx, code3xx, code4xx, code5xx } from "@toolmain/shared"
import { ElMessage } from "element-plus"

export type ElMessageType = "success" | "warning" | "info" | "error"
export interface ElMessage {
  msg: string
  code?: number
  type?: ElMessageType
}

const msgMap: Record<ElMessageType, (txt: string) => void> = {
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
  if (code2xx(code) || code1xx(code)) {
    return "success"
  } else if (code3xx(code)) {
    return "info"
  } else if (code4xx(code)) {
    return "warning"
  } else if (code5xx(code)) {
    return "error"
  } else {
    return "info"
  }
}

/**
 * element-plus 消息弹窗
 *
 * @param message 消息内容为字符串时，默认为`info`
 * ```plain
 * code类型:
 *  1xx|2xx success
 *  3xx     info
 *  4xx     warning
 *  5xx|6xx error
 *  default info
 * ```
 * @example
 * ```ts
 * msg({code:500,msg:"error"})
 * msg({code:200,msg:"success"})
 * msg("ok")
 * ```
 * `type` 和 `code` 同时存在时,`type`优先
 */
export function msg(message: ElMessage | string): void {
  if (typeof message === "string") {
    msg({
      msg: message,
      code: 300,
    })
    return
  }
  if (message.type) {
    msgMap[message.type](message.msg)
  } else if (message.code) {
    msgMap[codeToType(message.code)](message.msg)
  } else {
    msgMap.success(message.msg)
  }
}
