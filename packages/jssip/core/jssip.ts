import { ulid } from "ulid"
import * as vars from "./cause/index"
import * as JsSIP from "jssip"
import { type CauseData, type Config, type JsSipConfig, type Session } from "./type/jssip"
import { type AutoMedia, useMedia } from "./use/useMedia"
import { EventEmitter } from "events"
import type {
  CMDDTMF,
  CMDAnswer,
  CMDCall,
  CMDHangup,
  CMDHold,
  CMDMute,
  CMDSESSTION_DEL,
  CMDUnhold,
  CMDUnmute,
} from "./type/cmd"
import { Originator } from "./cause/on"
import {
  ConnectedEvent,
  DisconnectEvent,
  IncomingOptionsEvent,
  IncomingRTCSessionEvent,
  OutgoingOptionsEvent,
  OutgoingRTCSessionEvent,
  RegisteredEvent,
  UnRegisteredEvent,
  ConnectingEvent,
  CallOptions,
} from "jssip/src/UA"
import { IncomingRequest, IncomingResponse } from "jssip/src/SIPMessage"
import {
  ConnectingEvent as RTCConnectingEvent,
  PeerConnectionEvent,
  IncomingEvent,
  EndEvent,
  HoldEvent,
  IceCandidateEvent,
  IncomingAckEvent,
  OutgoingAckEvent,
  OutgoingEvent,
  MediaStreamTypes,
} from "jssip/src/RTCSession"

// JsSIP.debug.disable("JsSIP:*")
export class JSSipWraper extends EventEmitter {
  private readonly c: Config
  private readonly media: AutoMedia
  // protected retry: Retry
  protected ua: JsSIP.UA | null
  protected sessions: Record<string, Session>
  constructor(cfg?: JsSipConfig) {
    super()
    // https://jssip.net/documentation/3.10.x/api/ua_configuration_parameters/#section_mandatory
    this.c = this.__initConfig(cfg)
    // this.retry = useRetry()
    this.media = useMedia()
    this.sessions = {}
    this.ua = null
    return this
  }

  private dispatch<T extends vars.on>(type: T, data: CauseData): void {
    this.emit(type, data)
    this.emit(vars.on.ON_EVENT, data)
  }

  private dispatchSession(data: CauseData, isNew: boolean = false): void {
    if (isNew) {
      this.emit(vars.on.ON_NEWRTCSESSION, data)
      return
    }
    this.emit(vars.on.ON_RTCSESSION_STATE, data)
  }

  private __listenEvent() {
    if (this.ua) {
      // 连接中
      this.ua.on("connecting", (e: ConnectingEvent) => {
        const data = vars.resolve({
          msg: vars.on.ON_CONNECTING,
          uri: this.c.sip.uri,
          id: this.c.sip.sipWorkerid,
          code: 200,
          extra: {
            suffix: `(${e.attempts}次)`,
          },
          data: {
            attempts: e.attempts,
          },
        })
        this.dispatch(vars.on.ON_CONNECTING, data)
      })
      // 已连接
      this.ua.on("connected", (_e: ConnectedEvent) => {
        const data = vars.resolve({
          msg: vars.on.ON_CONNECTED,
          code: 200,
          id: this.c.sip.sipWorkerid,
          uri: this.c.sip.uri,
        })
        this.dispatch(vars.on.ON_CONNECTED, data)
      })
      // 已断开-注册/取消注册不会触发该事件
      this.ua.on("disconnected", (e: DisconnectEvent) => {
        const data = vars.resolve({
          msg: vars.on.ON_DISCONNECTED,
          code: 500,
          uri: this.c.sip.uri,
          id: this.c.sip.sipWorkerid,
          reason: e.reason,
          statusCode: e.code,
        })
        this.dispatch(vars.on.ON_DISCONNECTED, data)
      })
      // 已注册
      this.ua.on("registered", (e: RegisteredEvent) => {
        const data = vars.resolve({
          msg: vars.on.ON_REGISTERED,
          uri: this.c.sip.uri,
          id: this.c.sip.sipWorkerid,
          code: 200,
          statusCode: e.response?.status_code,
          reason: e.response?.reason_phrase,
        })
        this.dispatch(vars.on.ON_REGISTERED, data)
      })
      // 未注册
      this.ua.on("unregistered", (e: UnRegisteredEvent) => {
        const data = vars.resolve({
          msg: vars.on.ON_UNREGISTERED,
          uri: this.c.sip.uri,
          id: this.c.sip.sipWorkerid,
          code: 500,
          statusCode: e.response?.status_code,
          cause: e.cause ?? e.response?.reason_phrase,
        })
        this.dispatch(vars.on.ON_UNREGISTERED, data)
      })
      // 注册失败
      this.ua.on("registrationFailed", (e: UnRegisteredEvent) => {
        const res: CauseData = {
          msg: vars.on.ON_REGISTRATIONFAILED,
          uri: this.c.sip.uri,
          id: this.c.sip.sipWorkerid,
          code: 500,
          statusCode: e.response?.status_code,
          cause: e.cause ?? e.response?.reason_phrase,
        }
        if (!e.response) {
          res.msg = vars.on.ON_TIME_OUT
        } else {
          // todo
        }
        const data = vars.resolve(res)
        this.dispatch(vars.on.ON_REGISTRATIONFAILED, data)
      })
      // 注册过期
      this.ua.on("registrationExpiring", () => {
        vars.resolve({
          msg: vars.on.ON_REGISTRATIONEXPIRING,
          id: this.c.sip.sipWorkerid,
          uri: this.c.sip.uri,
          code: 200,
        })
        this.ua && this.ua.register()
        // this.dispatch(vars.on.ON_REGISTRATIONEXPIRING, d);
      })
      // 为传入或传出的 OPTIONS 请求触发。
      this.ua.on("newOptions", (e: IncomingOptionsEvent | OutgoingOptionsEvent) => {
        vars.resolve({
          msg: vars.on.ON_NEWOPTIONS,
          code: 200,
          uri: this.c.sip.uri,
          id: this.c.sip.sipWorkerid,
          originator: e.originator,
        })
        // this.dispatch(vars.on.ON_NEWOPTIONS, d);
      })
      // 为传入的对话 NOTIFY 请求触发。
      this.ua.on("sipEvent", (e: { event: any; request: IncomingRequest }) => {
        vars.resolve({
          msg: vars.on.ON_SIPEVENT,
          code: 200,
          uri: this.c.sip.uri,
          id: this.c.sip.sipWorkerid,
          data: {
            ruri: e.request.ruri,
          },
        })
        // this.dispatch(vars.on.ON_SIPEVENT, d);
      })
      // 为传入或传出会话/呼叫触发。
      this.ua.on("newRTCSession", (e: IncomingRTCSessionEvent | OutgoingRTCSessionEvent): void => {
        const sessionId: string = ulid()
        const sessionOrigin = e.session.direction

        this.sessions[sessionId] = {
          uri: "",
          originator: e.originator,
          id: sessionId,
          sessionOrigin,
          session: e.session,
        }
        const data = vars.resolve({
          id: this.c.sip.sipWorkerid,
          uri: this.c.sip.uri,
          msg: vars.on.ON_NEWRTCSESSION,
          originator: e.originator,
          code: 200,
          sessionOrigin,
          sessionId,
        })
        this.dispatchSession(data)
        /**
         * 呼出时存在PeerConnection
         */
        if (e.originator === Originator.LOCAL) {
          e.session.connection.addEventListener("track", (evt: RTCTrackEvent) => {
            this.media.playRemote(evt.streams)
          })
        }
        /**
         * 呼入时触发监听
         */
        e.session.on("peerconnection", (e: PeerConnectionEvent) => {
          e.peerconnection.addEventListener("track", (evt: RTCTrackEvent) => {
            this.media.playRemote(evt.streams)
          })
        })
        // 连接中
        e.session.on("connecting", (_e: RTCConnectingEvent) => {
          const data = vars.resolve({
            msg: vars.on.ON_SESSTION_CONNECTING,
            id: this.c.sip.sipWorkerid,
            uri: this.c.sip.uri,
            code: 200,
            sessionOrigin,
            sessionId,
          })
          this.dispatchSession(data)
        })
        // 响铃中
        e.session.on("progress", (e: IncomingEvent | OutgoingEvent) => {
          this.c.call.isRrequestTimeout = false
          const data = vars.resolve({
            msg: vars.on.ON_SESSION_PROGRESS,
            uri: this.c.sip.uri,
            id: this.c.sip.sipWorkerid,
            sessionId,
            sessionOrigin,
            code: 200,
            originator: e.originator,
            statusCode: e.originator === Originator.REMOTE ? e.response.status_code : 0,
            reason: e.originator === Originator.REMOTE ? e.response.reason_phrase : "",
          })
          this.dispatchSession(data)
        })
        // 连接已接受
        e.session.on("accepted", (e: IncomingEvent | OutgoingEvent) => {
          try {
            const data = vars.resolve({
              msg: vars.on.ON_SESSTION_ACCEPTED,
              uri: this.c.sip.uri,
              id: this.c.sip.sipWorkerid,
              sessionId,
              sessionOrigin,
              code: 200,
              originator: e.originator,
              statusCode: e.originator === Originator.REMOTE ? e.response.status_code : 0,
              reason: e.originator === Originator.REMOTE ? e.response.reason_phrase : "",
            })
            this.dispatchSession(data)
          } catch (_e) {
            const data = vars.resolve({
              msg: vars.on.ON_SESSION_ANSWER_FAILED,
              cause: vars.on.ON_SESSION_ANSWER_FAILED,
              code: 500,
              uri: this.c.sip.uri,
              id: this.c.sip.sipWorkerid,
              sessionOrigin,
              sessionId,
            })
            this.dispatchSession(data)
          }
        })
        // 接通,在这一步可以处理音频播放
        e.session.on("confirmed", (e: IncomingAckEvent | OutgoingAckEvent) => {
          const data = vars.resolve({
            msg: vars.on.ON_SESSTION_CONFIRMED,
            uri: this.c.sip.uri,
            id: this.c.sip.sipWorkerid,
            sessionId,
            sessionOrigin,
            code: 200,
            originator: e.originator,
          })
          this.dispatchSession(data)
        })
        // 结束
        e.session.on("ended", (e: EndEvent) => {
          const data = vars.resolve({
            msg: vars.on.ON_SESSTION_ENDED,
            uri: this.c.sip.uri,
            id: this.c.sip.sipWorkerid,
            sessionId,
            sessionOrigin,
            code: 500,
            originator: e.originator,
            cause: e.cause,
          })
          this.dispatchSession(data)
        })
        /**
         * 手动candidate 策略
         */
        e.session.on("icecandidate", (data: IceCandidateEvent) => {
          clearTimeout(this.c.call.icecandidateTimeout)
          // if (data.candidate.type === "srflx" && data.candidate.protocol === "udp") {
          //   data.ready()
          //   return
          // }
          this.c.call.icecandidateTimeout = window.setTimeout(() => {
            clearTimeout(this.c.call.icecandidateTimeout)
            // 强制终止candidate收集，以免没必要的等待
            data.ready()
          }, 2000)
        })
        e.session.on("sdp", _data => {
          // console.log(`[sdp:${data.originator}]`, data)
          // if (data.originator == Originator.REMOTE) {
          //   console.log("[sdp]", data)
          //   // const s = SDPUtils.splitSections(data.sdp);
          // }
        })
        e.session.on("peerconnection:createofferfailed", (data: any) => {
          console.log("[peerconnection:createofferfailed]", data)
        })
        e.session.on("peerconnection:createanswerfailed", (data: any) => {
          console.log("[peerconnection:createanswerfailed]", data)
        })
        e.session.on("peerconnection:setlocaldescriptionfailed", (data: any) => {
          console.log("[peerconnection:setlocaldescriptionfailed]", data)
        })
        e.session.on("peerconnection:setremotedescriptionfailed", (data: any) => {
          console.log("[peerconnection:setremotedescriptionfailed]", data)
        })
        // 失败
        e.session.on("failed", (e: EndEvent) => {
          console.log(e)
          const data: CauseData = {
            msg: vars.on.ON_SESSTION_FAILED,
            id: this.c.sip.sipWorkerid,
            uri: this.c.sip.uri,
            originator: e.originator,
            code: 500,
            sessionOrigin,
            sessionId,
            cause: e.cause,
            reason: e.originator === Originator.REMOTE ? (e?.message as IncomingResponse).reason_phrase : undefined,
            statusCode: e.originator === Originator.REMOTE ? (e?.message as IncomingResponse).status_code : undefined,
          }
          if (this.c.call.isRrequestTimeout) {
            /**
             * 连接超时，服务器未响应
             */
            data.msg = vars.on.ON_SESSION_TIMEOUT
            this.dispatchSession(vars.resolve(data))
            this.c.call.isRrequestTimeout = false
          } else {
            this.dispatchSession(vars.resolve(data))
            this.c.call.isRrequestTimeout = false
          }
        })
        // 保持
        e.session.on("hold", (e: HoldEvent) => {
          const data = vars.resolve({
            msg: vars.on.ON_HOLD,
            uri: this.c.sip.uri,
            id: this.c.sip.sipWorkerid,
            originator: e.originator,
            sessionOrigin,
            sessionId,
            code: 200,
          })
          this.dispatchSession(data)
        })
        // 继续
        e.session.on("unhold", (e: HoldEvent) => {
          const data = vars.resolve({
            msg: vars.on.ON_RESUME,
            uri: this.c.sip.uri,
            id: this.c.sip.sipWorkerid,
            originator: e.originator,
            sessionOrigin,
            sessionId,
            code: 200,
          })
          this.dispatchSession(data)
        })
        // 静音
        e.session.on("muted", (e: MediaStreamTypes) => {
          const data = vars.resolve({
            msg: vars.on.ON_MUTE,
            uri: this.c.sip.uri,
            id: this.c.sip.sipWorkerid,
            code: 200,
            sessionOrigin,
            sessionId,
            data: e,
          })
          this.dispatchSession(data)
        })
        // 取消静音
        e.session.on("unmuted", (e: MediaStreamTypes) => {
          const data = vars.resolve({
            msg: vars.on.ON_UNMUTE,
            uri: this.c.sip.uri,
            id: this.c.sip.sipWorkerid,
            code: 200,
            sessionOrigin,
            sessionId,
            data: e,
          })
          this.dispatchSession(data)
        })
      })
    }
  }

  private __initConfig(cfg?: JsSipConfig): Config {
    const _cfg: Config = {
      call: {
        calling: false, // 是否通话中
        icecandidateTimeout: 0,
        isRrequestTimeout: false,
        tryTimeOut: 0,
        transferNumber: "", // 转接号码
        phoneNumber: "", // 即将拨打的号码
      },
      sip: {
        viaTransport: "wss",
        sipWorkerid: "",
        sipServer: [], // wss://
        sipIce: [],
        sockets: [], // [JsSIP.WebSocketInterface]
        uri: "", // sip:xxx
        register_expires: 300,
        register: true, // 是否自动注册
      },
    }
    if (cfg) {
      Object.assign(_cfg.sip, cfg)
    }
    return _cfg
  }

  sessionById(sessionId?: string): Session | undefined {
    if (!sessionId) {
      return
    }
    return this.sessions[sessionId]
  }

  isConnected(): boolean {
    return Boolean(this.ua?.isConnected())
  }

  isRegistered(): boolean {
    return Boolean(this.ua?.isRegistered())
  }

  sipConfig(): JsSipConfig {
    return { ...this.c.sip }
  }

  sipInit(cfg: JsSipConfig) {
    Object.assign(this.c.sip, cfg)
    this.c.sip.audio && this.media.setAudio(this.c.sip.audio)
    return this
  }

  sipAnswer(data: CMDAnswer): void {
    const current = this.sessions[data.sessionId]
    if (current?.session) {
      if (current.session.isInProgress()) {
        current.session.answer()
      }
    }
  }

  sipCall(data: CMDCall): void {
    if (this.ua && this.ua.isRegistered()) {
      const optDef = {
        mediaConstraints: {
          audio: true,
          video: false,
        },
        sessionTimersExpires: 300,
        pcConfig: {
          iceServers: this.c.sip.sipIce,
        },
      }
      const Opt: CallOptions = data.options ? Object.assign({}, data.options, optDef) : optDef
      this.ua.call(data.target, Opt)
      return
    }
    console.warn("[jssip call] ua is not registered")
  }

  sipStop() {
    this.ua?.terminateSessions()
    this.ua?.unregister({
      all: true,
    })
    this.ua?.stop()
    // this.ua?.removeAllListeners()
    this.ua = null
  }

  sipLogin() {
    try {
      if (!this.isConnected()) {
        // this.ua?.stop()
        const sockets = this.c.sip.sipServer.map((addr: string) => {
          const s = new JsSIP.WebSocketInterface(addr)
          s.via_transport = this.c.sip.viaTransport
          return s
        })
        this.c.sip.sockets = sockets
        this.ua?.removeAllListeners()
        this.ua = new JsSIP.UA(this.c.sip)
        this.__listenEvent()
        this.ua.start()
      } else if (!this.isRegistered()) {
        this.ua?.register()
      } else {
        console.warn(`[jssip login] ua is already logined`)
      }
    } catch (e) {
      console.error("[jssip login]", e)
    }
  }

  sipRegister() {
    if (this.ua) {
      if (!this.ua.isRegistered()) {
        this.ua.register()
        return
      } else {
        console.warn(`[jssip register] ua is already registerd`)
      }
    }
    console.warn(`[jssip register] ua is not initialized`)
  }

  sipUnregister() {
    this.ua?.unregister()
  }

  sipSessionDel(data: CMDSESSTION_DEL) {
    this.sipHangUp({
      ...data,
      isTimeout: false,
    })
    if (this.sessions[data.sessionId]) {
      delete this.sessions[data.sessionId]
    }
  }

  private isSessionEstab(sid: string): boolean {
    const s = this.sessions[sid]
    if (!s) {
      return false
    }
    const session = s.session
    if (!session) {
      return false
    }
    return session.isEstablished()
    // return true
  }

  sipHangUp(data: CMDHangup) {
    if (this.sessions[data.sessionId]) {
      this.c.call.isRrequestTimeout = data.isTimeout
      const session = this.sessions[data.sessionId].session
      if (!session) {
        return
      }
      if (session.isInProgress() || session.isEstablished()) {
        this.sessions[data.sessionId].session?.terminate()
      }
    }
  }

  sipDTMF(data: CMDDTMF) {
    if (this.isSessionEstab(data.sessionId)) {
      this.sessions[data.sessionId].session?.sendDTMF(data.tone)
    }
  }

  sipHold(data: CMDHold) {
    /**
     * {local: false, remote: false}
     */
    // if (this.session && this.session.isEstablished() && !this.session.isOnHold()) {
    if (this.isSessionEstab(data.sessionId)) {
      this.sessions[data.sessionId].session?.hold()
    }
  }

  sipResume(data: CMDUnhold) {
    // if (this.session && this.session.isOnHold()) {
    if (this.isSessionEstab(data.sessionId)) {
      this.sessions[data.sessionId].session?.unhold()
    }
  }

  sipMute(data: CMDMute) {
    /**
     * {audio: false, video: false}
     */
    if (this.isSessionEstab(data.sessionId)) {
      this.sessions[data.sessionId].session?.mute({
        audio: true,
        video: false,
      })
    }
  }

  sipUnmute(data: CMDUnmute) {
    if (this.isSessionEstab(data.sessionId)) {
      this.sessions[data.sessionId].session?.unmute({
        audio: true,
        video: false,
      })
    }
  }
}
