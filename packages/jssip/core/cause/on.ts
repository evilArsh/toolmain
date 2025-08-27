export enum Originator {
  LOCAL = "local",
  REMOTE = "remote",
  SYSTEM = "system",
}
export enum on {
  ON_TIME_OUT = "Request Timeout",
  ON_EVENT = "event",
  ON_REGISTERED = "registered",
  ON_UNREGISTERED = "unregistered",
  ON_REGISTRATIONFAILED = "registrationFailed",
  ON_REGISTRATIONEXPIRING = "registrationExpiring",
  ON_CONNECTING = "connecting",
  ON_CONNECTED = "connected",
  ON_DISCONNECTED = "disconnected",
  ON_NEWOPTIONS = "newOptions",
  ON_SIPEVENT = "sipEvent",
  ON_NEWRTCSESSION = "newRTCSession",
  ON_RTCSESSION_STATE = "new_RTCSession_state",
  // ON_NEW_REMOTE_RTCSESSION = "new_remote_RTCSession",
  // ON_NEW_LOCAL_RTCSESSION = "new_local_RTCSession",
  ON_NEWMESSAGE = "newMessage",
  ON_SESSION_PROGRESS = "session_progress",
  ON_SESSTION_CONNECTING = "session_connecting",
  ON_SESSTION_ACCEPTED = "session_accepted",
  ON_SESSTION_CONFIRMED = "session_confirmed",
  ON_SESSTION_ENDED = "session_ended",
  ON_SESSTION_FAILED = "session_failed",
  ON_SESSION_ANSWER_FAILED = "session_answer_failed",
  ON_RESUME = "onResume",
  ON_HOLD = "onHold",
  ON_MUTE = "onMute",
  ON_UNMUTE = "onUnmute",
  ON_SESSION_RECALL = "session_recall",
  ON_RE_REGISTERED = "re_register",
  ON_RE_LOGIN = "re_login",
  ON_SESSION_TIMEOUT = "session_req_timeout",
  ON_LISTEN_EVENT = "call_event",
}
const onCN: Record<string, string> = {
  [on.ON_TIME_OUT]: "连接超时",
  [on.ON_EVENT]: "新事件",
  [on.ON_REGISTERED]: "已签入",
  [on.ON_UNREGISTERED]: "未签入",
  [on.ON_REGISTRATIONFAILED]: "签入失败",
  [on.ON_REGISTRATIONEXPIRING]: "签入即将过期",
  [on.ON_CONNECTING]: "登录中",
  [on.ON_CONNECTED]: "已连接",
  [on.ON_DISCONNECTED]: "连接断开",
  // [on.ON_ERROR]: "websocket错误",
  [on.ON_NEWOPTIONS]: "newOptions",
  [on.ON_SIPEVENT]: "sipEvent",
  [on.ON_NEWRTCSESSION]: "新通话",
  [on.ON_RTCSESSION_STATE]: "通话状态",
  // [on.ON_NEW_LOCAL_RTCSESSION]: "新通话",
  // [on.ON_NEW_REMOTE_RTCSESSION]: "新来电",
  [on.ON_NEWMESSAGE]: "新消息",
  [on.ON_SESSION_PROGRESS]: "响铃中",
  [on.ON_SESSTION_CONNECTING]: "拨号中",
  [on.ON_SESSTION_ACCEPTED]: "通话接受",
  [on.ON_SESSTION_CONFIRMED]: "通话中",
  [on.ON_SESSTION_ENDED]: "通话结束:1",
  [on.ON_SESSTION_FAILED]: "通话结束:2",
  [on.ON_SESSION_ANSWER_FAILED]: "通话结束:3",
  [on.ON_RESUME]: "继续",
  [on.ON_HOLD]: "保持",
  [on.ON_MUTE]: "静音",
  [on.ON_UNMUTE]: "取消静音",
  [on.ON_SESSION_RECALL]: "重拨中",
  [on.ON_RE_REGISTERED]: "进行重连",
  [on.ON_RE_LOGIN]: "进行重连",
  [on.ON_SESSION_TIMEOUT]: "拨号超时",
  [on.ON_LISTEN_EVENT]: "呼叫事件",
}
export const isSession = (_on: string): boolean => {
  const arr: string[] = [
    on.ON_NEWRTCSESSION,
    on.ON_SESSION_PROGRESS,
    on.ON_SESSION_ANSWER_FAILED,
    on.ON_SESSION_RECALL,
    on.ON_SESSION_TIMEOUT,
    on.ON_RESUME,
    on.ON_HOLD,
    on.ON_MUTE,
    on.ON_UNMUTE,
  ]
  return arr.includes(_on)
}
export const onToCN = (on: string): string => {
  const str = on
  return onCN[str] || "未定义的事件"
}

export const isOnEvent = (evt: string): boolean => {
  return Boolean(onCN[evt])
}
