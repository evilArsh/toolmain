import * as JsSIP from "jssip"
import { isOnEvent, isSession, onToCN, Originator } from "./on"
import { sipCode } from "./sipCode"
import { type CauseData } from "../type/jssip"
import { isSocketCode, socketToCN } from "./socketCode"

/**
 * https://jssip.net/documentation/3.10.x/api/causes/
 */
const record: Record<string, string> = {
  [JsSIP.C.causes.CONNECTION_ERROR]: "websocket连接出错",
  [JsSIP.C.causes.REQUEST_TIMEOUT]: "请求超时",
  [JsSIP.C.causes.SIP_FAILURE_CODE]: "SIP代码",
  [JsSIP.C.causes.INTERNAL_ERROR]: "发生内部错误",
  [JsSIP.C.causes.BUSY]: "用户忙", // 486,600
  [JsSIP.C.causes.REJECTED]: "拒绝连接", // 403,603
  [JsSIP.C.causes.REDIRECTED]: "重定向", // 300,301,302,305,380
  [JsSIP.C.causes.UNAVAILABLE]: "号码无效/空号", // 480,410,408,430
  [JsSIP.C.causes.NOT_FOUND]: "号码未找到", // 404,604
  [JsSIP.C.causes.ADDRESS_INCOMPLETE]: "账号有误", // 484
  [JsSIP.C.causes.INCOMPATIBLE_SDP]: "媒体协商错误,请重试:1", // 488,606
  [JsSIP.C.causes.MISSING_SDP]: "媒体协商错误,请重试:2",
  [JsSIP.C.causes.AUTHENTICATION_ERROR]: "账号或密码错误", // 401,407
  [JsSIP.C.causes.BYE]: "已挂断",
  [JsSIP.C.causes.WEBRTC_ERROR]: "WebRTC错误",
  [JsSIP.C.causes.CANCELED]: "通话已取消",
  [JsSIP.C.causes.NO_ANSWER]: "未接听", // Incoming
  [JsSIP.C.causes.EXPIRES]: "Expires", // Incoming
  [JsSIP.C.causes.NO_ACK]: "No ACK", // incoming
  [JsSIP.C.causes.DIALOG_ERROR]: "408/481错误",
  [JsSIP.C.causes.USER_DENIED_MEDIA_ACCESS]: "麦克风权限获取失败",
  [JsSIP.C.causes.BAD_MEDIA_DESCRIPTION]: "错误的SDP信息",
  [JsSIP.C.causes.RTP_TIMEOUT]: "RTP 丢失,会话结束",
}

/**
 * https://jssip.net/documentation/3.10.x/api/causes/
 * 以下是jssip对于cause 中 session 的分类
 */
const session: string[] = [
  JsSIP.C.causes.BYE,
  JsSIP.C.causes.CANCELED,
  JsSIP.C.causes.NO_ANSWER,
  JsSIP.C.causes.EXPIRES,
  JsSIP.C.causes.NO_ACK,
  JsSIP.C.causes.DIALOG_ERROR,
  JsSIP.C.causes.USER_DENIED_MEDIA_ACCESS,
  JsSIP.C.causes.BAD_MEDIA_DESCRIPTION,
  JsSIP.C.causes.RTP_TIMEOUT,
]

/**
 * https://jssip.net/documentation/3.10.x/api/causes/
 * 以下是jssip对于cause 中 common 的分类
 */
const common: string[] = [
  JsSIP.C.causes.CONNECTION_ERROR,
  JsSIP.C.causes.REQUEST_TIMEOUT,
  JsSIP.C.causes.SIP_FAILURE_CODE,
  JsSIP.C.causes.INTERNAL_ERROR,
]

/**
 * https://jssip.net/documentation/3.10.x/api/causes/
 * 以下是jssip对于cause 中 sipError 的分类
 */
const sipError: string[] = [
  JsSIP.C.causes.BUSY,
  JsSIP.C.causes.REJECTED,
  JsSIP.C.causes.REDIRECTED,
  JsSIP.C.causes.UNAVAILABLE,
  JsSIP.C.causes.NOT_FOUND,
  JsSIP.C.causes.ADDRESS_INCOMPLETE,
  JsSIP.C.causes.INCOMPATIBLE_SDP,
  JsSIP.C.causes.MISSING_SDP,
  JsSIP.C.causes.AUTHENTICATION_ERROR,
  JsSIP.C.causes.BYE,
]

/**
 * 判断是否是session类jssip cause
 * @param cause - https://jssip.net/documentation/3.10.x/api/causes/
 */
const isSessionCause = (cause: string): boolean => {
  return session.includes(cause)
}

/**
 * 判断是否是session类jssip common
 * @param cause - https://jssip.net/documentation/3.10.x/api/causes/
 */
const isCommonCause = (cause: string): boolean => {
  return common.includes(cause)
}

/**
 * 判断是否是session类jssip sipError
 * @param cause - https://jssip.net/documentation/3.10.x/api/causes/
 */
const isSipErrorCause = (cause: string): boolean => {
  return sipError.includes(cause)
}
const transOriginator = (originator?: string): string => {
  switch (originator) {
    case Originator.LOCAL:
      return "本地:"
    case Originator.REMOTE:
      return "远端:"
    case Originator.SYSTEM:
      return "系统:"
    default:
      return ""
  }
}
/**
 * 将sipcode/websocket code/jssip cause code 翻译成中文
 * @param cause - https://jssip.net/documentation/3.10.x/api/causes/
 * @param sCode - sip code 或者 websocket code
 */
const toCN = (cause?: string, sCode?: number): string => {
  if (cause) {
    if (isSipErrorCause(cause) || JsSIP.C.causes.SIP_FAILURE_CODE === cause) {
      return sipCodeCN(cause, sCode)
    } else if (isSocketCode(sCode)) {
      return socketToCN(sCode)
    } else if (isOnEvent(cause)) {
      return onToCN(cause)
    }
    return record[cause] || cause
  }
  return ""
}
/**
 * 加工 `cause` 并返回副本
 * - 转换成中文原因
 * - 设置时间
 * - 处理:
 * - ev.ON_UNREGISTERED
 * - ev.ON_REGISTRATIONFAILED
 * - ev.ON_SESSTION_ENDED 有originator
 * - ev.ON_SESSTION_FAILED 有originator
 * @param cause - 待加工的数据
 * @param log - 是否打开日志开关
 */
const resolve = (cause: CauseData, log: boolean = true): CauseData => {
  const _cause = { ...cause }
  _cause.causeCN = `${transOriginator(_cause.originator)}${toCN(_cause.cause, _cause.statusCode)}`
  _cause.msgCN = `${onToCN(_cause.msg)}`
  // _cause.time = unref(useDateFormat(new Date(), "YYYY-MM-DD HH:mm:ss").value)
  if (log) {
    console.log(`${isSession(_cause.msg) ? "RTCSession:" : ""}[${_cause.msg}]`, _cause)
  }
  return _cause
}
const _sipCodeCN = (code?: number): string => {
  if (code) {
    const sip = sipCode[String(code)]
    if (sip) {
      return sip[1]
    } else {
      return ""
    }
  } else {
    return ""
  }
}
/**
 * 将sip代码翻译成对应的中文
 *
 * @param cause - https://jssip.net/documentation/3.10.x/api/causes/
 * @param code - sip code
 */
const sipCodeCN = (cause: string, code?: number): string => {
  if (code) {
    return record[cause] + code + _sipCodeCN(code)
  }
  return record[cause] || ""
  // return "未知sip状态码:" + code
}
export {
  record,
  session,
  common,
  sipError,
  toCN,
  sipCodeCN,
  resolve,
  isSessionCause,
  isCommonCause,
  isSipErrorCause,
  transOriginator,
}
