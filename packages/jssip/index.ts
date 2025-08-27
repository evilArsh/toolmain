/**
 * @author arsh <arshdebian@163.com>
 * @copyright arsh 2023
 * @license MIT
 */
import { JSSipWraper } from "./core/jssip"
import { cmd, type CMDMap, type CMDData } from "./core/type/cmd"
import { type JsSipConfig } from "./core/type/jssip"
import { useMedia, type AutoMedia } from "./core/use/useMedia"
import { useRetry, type Retry } from "./core/use/useRetry"
export class SipWorker extends JSSipWraper {
  postMessage<T extends cmd>(type: T, data: CMDData<T>): void {
    try {
      switch (type) {
        case cmd.INIT: {
          const dataInit = data as CMDMap[cmd.INIT]
          const jData: JsSipConfig = { ...dataInit, sockets: [] }
          this.sipInit(jData)
          break
        }
        case cmd.CALL: {
          const dataCall = data as CMDMap[cmd.CALL]
          this.sipCall(dataCall)
          break
        }
        case cmd.ANSWER: {
          const dataAns = data as CMDMap[cmd.ANSWER]
          this.sipAnswer(dataAns)
          break
        }
        case cmd.LOGIN:
          this.sipLogin()
          break
        case cmd.LOGOUT:
          this.sipStop()
          break
        case cmd.REGISTER:
          this.sipRegister()
          break
        case cmd.UNREGISTER:
          this.sipUnregister()
          break
        case cmd.HANGUP: {
          const dataHangup = data as CMDMap[cmd.HANGUP]
          this.sipHangUp(dataHangup)
          break
        }
        case cmd.SESSTION_DEL: {
          const dataSesstionDel = data as CMDMap[cmd.SESSTION_DEL]
          this.sipSessionDel(dataSesstionDel)
          break
        }
        case cmd.HOLD: {
          const dataHold = data as CMDMap[cmd.HOLD]
          this.sipHold(dataHold)
          break
        }
        case cmd.UNHOLD: {
          const dataUnhold = data as CMDMap[cmd.UNHOLD]
          this.sipResume(dataUnhold)
          break
        }
        case cmd.MUTE: {
          const dataMute = data as CMDMap[cmd.MUTE]
          this.sipMute(dataMute)
          break
        }
        case cmd.UNMUTE: {
          const dataUnmute = data as CMDMap[cmd.UNMUTE]
          this.sipUnmute(dataUnmute)
          break
        }
        case cmd.DTMF: {
          const dataDTMF = data as CMDMap[cmd.DTMF]
          this.sipDTMF(dataDTMF)
          break
        }
        case cmd.EMPTY:
          break
        case cmd.NOTIFY:
          break
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export * from "./core/cause/index"
export * from "./core/type/cmd"
export * from "./core/type/jssip"
export { JSSipWraper, useMedia, useRetry }
export type { AutoMedia, Retry }
