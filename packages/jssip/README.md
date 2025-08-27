# Overview

- jssip 库的封装，加入中文错误提示和ice candidate策略

- 支持一个 UA 多个 RTCSession 同时拨打和接听

- ~~使用 vue~~

- 库使用Typescript编写并提供 `.d.ts` 文件，可用在`react`或者`vue`环境中

## Change log

### v1.0.1 锁定jssip版本号为3.10.0

### v1.0.3 修改useMedia::playUrl内部播放逻辑

### v1.0.4 删除vue依赖

### v1.0.5 解决IOS无法通过动态创建 audio 标签播放音频轨道

## Usage 用法

包目录结构。使用时应包含所有文件

```typescript
++jssip
--package.json
++dist
--index.js
--index.d.ts
```

由于浏览器的限制（WebRTC以及麦克风权限限制），使用时必须在https站点下

## 拨号流程

1.实例化`SipWorker`类

2.通过实例方法`postMessage`进行 `初始化` `登录` `拨号` `挂断` `静音` `取消静音` `暂停` `取消暂停`操作

3.通过实例方法`on`监听拨号后的事件,详细的事件可在该文档中的`Type 拨号命令以及消息事件枚举`部分查看

4.每当发起一次通话或者收到电话,jssip库会产生一个`session`会话，用户可以通过`SipWorker`类的`on`方法监听这个`session`

## 示例代码

```typescript
import { SipWorker, cmd, on, CauseData } from "path/to/你放置该库的根路径"
import { ulid } from "ulid" // 或者 uuid
/**
 * SipWorker 是拨号类，必须先实例化
 */
const sip = new SipWorker()
/**
 * 初始化，拨号之前要初始化
 */
sip.postMessage(cmd.INIT, {
  /**
   * 
   * 传id或者HTMLAudioElement
   * 用于播放音频流
   *
   * ios中动态创建的audio标签无法播放音频
   * 安卓和PC可以动态创建标签，可以不传该字段
   */
  audio: document.getElementById("audioId"),
  viaTransport: "wss", // 固定wss
  uri: "sip:your_account@192.168.1.1", // 格式:sip:账号@拨号服务器IP
  sipWorkerid: ulid(), // 随机字符串
  sipServer: ["wss://192.168.1.1:8089/ws"],// 格式:wss://拨号服务器IP:端口/ws
  // 如果没有，留空数组
  sipIce: ["stun:192.168.1.1:3478"], // 格式:stun:拨号服务器IP:STUN端口
  /**
   * 自动注册，如果false,需要手动调用
   * sip.postMessage(cmd.LOGIN, null);
   */
  register: true,
  password: "your_account's password", // 密码
  realm: "192.168.1.1", // 格式：拨号服务器IP
})
/**
 * 登录
 */
sip.postMessage(cmd.LOGIN, null)
/**
 * 登出
 */
sip.postMessage(cmd.LOGOUT, null)
/**
 * 拨号
 */
sip.postMessage(cmd.CALL, {
  target: "10086",// 要拨打的号码
})
/**
 * 挂电话
 */
sip.postMessage(cmd.HANGUP, {
  isTimeout: false,
  sessionId: `sessionId`,
})
/**
 * 通话session状态发生变化
 * 收到电话或者拨号会触发此事件
 */
sip.on(on.ON_RTCSESSION_STATE, (res: CauseData) => {
    switch (res.msg) {
      case on.ON_SESSTION_ACCEPTED: // 已接受
      case on.ON_SESSTION_CONFIRMED: // 已接听
        break;
      case on.ON_SESSTION_FAILED: // 通话失败
      case on.ON_SESSTION_ENDED: // 通话结束
        break;
      case on.ON_NEWRTCSESSION: // 新的通话session到来
        //! 呼出
        if (res.sessionOrigin == "outgoing") {
          console.log("会话ID:",res.sessionId;)
        } else {
          console.log("会话ID:",res.sessionId;)
          const sessionId = res.sessionId;
          // console.log(">>>呼入", uSip.sip.sessionById(sessionId));
          const fromUser = uSip.sip.sessionById(sessionId).session.remote_identity.uri.user;
          console.log("呼入者:",fromUser)
          // 接听
          uSip.sip.postMessage(cmd.ANSWER, {
            sessionId,
          });
          // 挂断/拒接
          uSip.sip.postMessage(cmd.HANGUP, {
            sessionId,
          });
        }
    }
})
// 注册
sip.on(on.ON_REGISTERED, () => {
  console.log("已注册")
});
sip.on(on.ON_UNREGISTERED, () => {
  console.log("未注册")
});
// 静音
sip.on(on.ON_MUTE, () => {
  console.log("静音")
});
sip.on(on.ON_UNMUTE, () => {
  console.log("取消静音")
});
sip.on(on.ON_RESUME, () => {
  console.log("继续")
});
sip.on(on.ON_HOLD, () => {
  console.log("保持")
});

// 失败
sip.on(on.ON_DISCONNECTED, res => {
  /**
   * 触发原因：
   * 1. 由于服务器使用自签证书，需要手动访问拨号服务器的 https 站点手动验证，端口和地址为cmd.INIT时的sipServer字段值，并且wss改为https
   * 2. 由于网络环境不稳定等其他原因
   *
   */
  console.log("socket 连接失败",res)
});
sip.on(on.ON_REGISTRATIONFAILED, res => {
  console.log("socket 连接成功，但是sip注册失败",res)
});
// etc...
```

## 额外可供使用的工具

```typescript
import { useMedia, useRetry } from "path/to/你放置该库的根路径"

// 播放音频流或者音频url
/**
export interface AutoMedia {
  playRemote: (media: readonly MediaStream[]) => void
  playUrl: (url: string) => void
  stopPlayUrl: () => void
}
 */
const media = useMedia()
// eg:
media.playUrl("xxx.mp3")
/**
export interface Retry {
  // 更新最大重试次数
  updateMaxRetry: (id: string, maxRetry: number) => void
  // 获取重试次数
  getRetryTime: (id: string) => number
  // 是否到达最大重试次数
  isMax: (id: string) => boolean
  // 重试，如果可以重试，返回true，否则返回false
  retry: (id: string) => boolean
  // 重置重试次数
  reset: (id: string) => void
  // 延迟重试
  // id 重试唯一id
  // cb 回调函数
  // increase 每次重试递增时间
  // 返回: 0:超过重试次数，大于0:下次重试时间
  delayRetry: (id: string, cb: () => void, increase?: number) => number
}
*/
const retry = useRetry()
```

## Type 拨号命令以及消息事件枚举

```typescript
// sip 操作命令
export declare enum cmd {
  INIT = "INIT", // 数据初始化操作
  LOGIN = "LOGIN", // 连接socket并登录sip服务器
  CALL = "CALL", // 拨打电话
  ANSWER = "ANSWER", // 接听电话
  LOGOUT = "LOGOUT", // 断开socket并且登出sip服务器
  HANGUP = "HANGUP", // 挂断电话
  HOLD = "HOLD", // 保持通话
  UNHOLD = "ONHOLD", // 取消保持通话，继续
  MUTE = "MUTE", // 静音
  UNMUTE = "UNMUTE", // 取消静音
  REGISTER = "REGISTER", // 注册sip服务
  SESSTION_DEL = "SESSTION_DEL", // 删除sessionId,并且挂电话
  UNREGISTER = "UNREGISTER", // 保持socket连接，但登出sip服务
  NOTIFY = "NOTIFY", // unused
  EMPTY = "EMPTY", // unused
}
// sip 消息事件
export declare enum on {
  ON_TIME_OUT = "Request Timeout", // 请求超时
  ON_REGISTERED = "registered", // 已注册
  ON_UNREGISTERED = "unregistered", // 未注册（或已登出）
  ON_REGISTRATIONFAILED = "registrationFailed", // 注册失败
  ON_REGISTRATIONEXPIRING = "registrationExpiring", // 注册即将过期，库会自动重新注册
  ON_CONNECTING = "connecting", // socket连接中
  ON_CONNECTED = "connected", // socket 已连接
  ON_DISCONNECTED = "disconnected", // socket 已断开
  ON_NEWRTCSESSION = "newRTCSession", // 新的通话，呼入或者呼出
  ON_RTCSESSION_STATE = "new_RTCSession_state", // 通话session的状态
  ON_SESSION_PROGRESS = "session_progress", // 183 session建立中，早期媒体(early media) 时期
  ON_SESSTION_CONNECTING = "session_connecting", // 通话线路正在连接
  ON_SESSTION_ACCEPTED = "session_accepted", // 通话已被接受
  ON_SESSTION_CONFIRMED = "session_confirmed", // 通话已确认（已接通）
  ON_SESSTION_ENDED = "session_ended", // 通话结束
  ON_SESSTION_FAILED = "session_failed", // 通话失败
  ON_SESSION_ANSWER_FAILED = "session_answer_failed", // 通话应答失败
  ON_RESUME = "onResume", // 已继续
  ON_HOLD = "onHold", // 已保持
  ON_MUTE = "onMute", // 已静音
  ON_UNMUTE = "onUnmute", // 已取消静音
  ON_EVENT = "event", // unused
  ON_NEWOPTIONS = "newOptions", // unused
  ON_SIPEVENT = "sipEvent", // unused
  ON_NEWMESSAGE = "newMessage", // unused
  ON_SESSION_RECALL = "session_recall", // unused
  ON_RE_REGISTERED = "re_register", // unused
  ON_RE_LOGIN = "re_login", // unused
  ON_SESSION_TIMEOUT = "session_req_timeout", // unused
  ON_LISTEN_EVENT = "call_event", // unused
}

// sip事件消息格式
export declare type CauseData = {
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
    suffix?: string
    prefix?: string
  }
  /**
   * 额外data，每个msg可能有额外的数据
   */
  data?: any
}

export declare class SipWorker extends JSSipWraper {
  constructor(cfg?: JsSipConfig)
  postMessage<T extends cmd>(type: T, data: CMDData<T>): void
}
```

```typescript
postMessage 命令
export declare interface CMDMap {
    [cmd.INIT]: CMDInit;
    [cmd.CALL]: CMDCall;
    [cmd.ANSWER]: CMDAnswer;
    [cmd.HANGUP]: CMDHangup;
    [cmd.LOGIN]: CMDLogin;
    [cmd.LOGOUT]: CMDLogout;
    [cmd.EMPTY]: CMDEmpty;
    [cmd.HOLD]: CMDHold;
    [cmd.SESSTION_DEL]: CMDSESSTION_DEL;
    [cmd.UNHOLD]: CMDUnhold;
    [cmd.MUTE]: CMDMute;
    [cmd.UNMUTE]: CMDUnmute;
    [cmd.REGISTER]: CMDRegister;
    [cmd.UNREGISTER]: CMDUnregister;
    [cmd.NOTIFY]: CMDNotify;
}
export declare type CMDCall = {
    target: string;
    options?: CallOptions; =>> import type { CallOptions } from 'jssip/lib/UA';
};
export declare type CMDHangup = {
    /**
     * 是否以客户端假定是拨打超时的方式挂断电话
     */
    sessionId: string;
    isTimeout: boolean;
};
export declare type CMDAnswer = {
    sessionId: string;
};

```

# 测试

可访问 https://vivcode.cn/jssip 测试
