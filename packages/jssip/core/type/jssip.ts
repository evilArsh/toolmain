import { type UAConfiguration } from "jssip/lib/UA"
import { type Originator } from "../cause/on"
import { type RTCSession } from "jssip/lib/RTCSession"

export interface Config {
  call: JsSipCallConfig
  sip: JsSipConfig
}
export interface JsSipCallConfig {
  calling: boolean // 是否通话中
  // callQueueNum: number
  // icecandidateCount: number
  icecandidateTimeout: number
  isRrequestTimeout: boolean
  tryTimeOut: number
  transferNumber?: string // 转接号码
  phoneNumber?: string // 即将拨打的号码
}
export type JsSipConfig = {
  /**
   * 用于播放音频流
   *
   * ios中动态创建的audio标签无法播放音频
   */
  audio?: HTMLAudioElement | string
  /**
   * - client-wss-nginx-ws-freeswitch nginx 代理wss 至 freeswitch的ws端口时，该字段需要设置为ws
   * - client-wss-freeswitch 设置位wss
   */
  viaTransport: string
  sipWorkerid: string
  sipServer: string[] // wss://
  sipIce: RTCIceServer[]
  // singleMode: true
} & UAConfiguration

/**
 * 拨号session incoming 和 outcoming
 */
export interface Session {
  id: string
  /**
   * 标识session消息的发出方
   */
  originator: Originator.LOCAL | Originator.REMOTE | Originator.SYSTEM
  /**
   * 该字段标识`主叫`或者`被叫`
   */
  // sessionOrigin: Originator.LOCAL | Originator.REMOTE | Originator.SYSTEM
  sessionOrigin: "incoming" | "outgoing"
  uri: string
  incomingUri?: string
  session?: RTCSession
}

// https://jssip.net/documentation/3.10.x/api/causes/
export interface CauseData {
  /**
   * JsSIP实例id
   */
  id: string
  /**
   * sip账号
   */
  uri: string
  /**
   * 呼入时：呼叫方的uri
   */
  fromUri?: string
  /**
   * 事件ON_* on.ts 中声明
   */
  msg: string
  /**
   * 200 500 etc.
   */
  code: number
  /**
   *
   * 当CauseData由session发出时，该字段标识JsSIP每个UA下不同的RTCSession id
   */
  sessionId?: string
  /**
   * 当CauseData由session发出时，该字段标识`主叫`或者`被叫`
   */
  sessionOrigin?: "incoming" | "outgoing"
  // sessionOrigin?: Originator.LOCAL | Originator.REMOTE | Originator.SYSTEM
  /**
   * 事件的中文翻译
   */
  msgCN?: string
  /**
   * 标识sip,socket,session,ua消息的发出方
   */
  originator?: Originator.LOCAL | Originator.REMOTE | Originator.SYSTEM
  /**
   * 如果出现错误，错误的原因
   */
  cause?: string
  /**
   * 错误原因中文
   */
  causeCN?: string
  /**
   * sip 或者 websocket状态码
   */
  statusCode?: number
  /**
   * sip 或者 websocket 状态码对应的具体原因
   */
  reason?: string
  /**
   * 消息生成时间
   */
  time?: string | number | Date | undefined
  /**
   * 额外cause数据
   */
  extra?: {
    // 对causeCN的补充,`prefix + causeCN + suffix`
    suffix?: string
    prefix?: string
  }
  /**
   * 额外data，每个msg可能有额外的数据
   */
  data?: any
}
