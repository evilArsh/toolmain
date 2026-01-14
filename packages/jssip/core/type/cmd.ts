import { type CallOptions } from "jssip/src/UA"
import { type JsSipConfig } from "./jssip"

export enum cmd {
  LOGIN = "LOGIN",
  INIT = "INIT",
  CALL = "CALL",
  ANSWER = "ANSWER",
  LOGOUT = "LOGOUT",
  HANGUP = "HANGUP",
  HOLD = "HOLD",
  UNHOLD = "ONHOLD",
  MUTE = "MUTE",
  UNMUTE = "UNMUTE",
  REGISTER = "REGISTER",
  SESSTION_DEL = "SESSTION_DEL",
  UNREGISTER = "UNREGISTER",
  NOTIFY = "NOTIFY",
  EMPTY = "EMPTY",
  DTMF = "DTMF",
}

/**
 * sockets 在 class JSSip 内部维护
 */
export type CMDInit = Omit<JsSipConfig, "sockets">
export interface CMDCall {
  target: string
  options?: CallOptions
}
export interface CMDAnswer {
  sessionId: string
}
export interface CMDHangup {
  /**
   * 是否以客户端假定是拨打超时的方式挂断电话
   */
  sessionId: string
  isTimeout: boolean
}
export interface CMDSESSTION_DEL {
  sessionId: string
}
export interface CMDHold {
  sessionId: string
}
export interface CMDUnhold {
  sessionId: string
}
export interface CMDMute {
  sessionId: string
}
export interface CMDUnmute {
  sessionId: string
}
export interface CMDDTMF {
  sessionId: string
  tone: string
}
export type CMDLogout = any
export type CMDEmpty = any
export type CMDLogin = any
export type CMDRegister = any
export type CMDUnregister = any
export type CMDNotify = any

export interface CMDMap {
  [cmd.INIT]: CMDInit
  [cmd.CALL]: CMDCall
  [cmd.ANSWER]: CMDAnswer
  [cmd.HANGUP]: CMDHangup
  [cmd.LOGIN]: CMDLogin
  [cmd.LOGOUT]: CMDLogout
  [cmd.EMPTY]: CMDEmpty
  [cmd.HOLD]: CMDHold
  [cmd.SESSTION_DEL]: CMDSESSTION_DEL
  [cmd.UNHOLD]: CMDUnhold
  [cmd.MUTE]: CMDMute
  [cmd.UNMUTE]: CMDUnmute
  [cmd.REGISTER]: CMDRegister
  [cmd.UNREGISTER]: CMDUnregister
  [cmd.NOTIFY]: CMDNotify
  [cmd.DTMF]: CMDDTMF
}

export type CMDData<T extends cmd> = CMDMap[T]
