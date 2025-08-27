/**
 * https://www.rfc-editor.org/rfc/rfc6455
 */
export const socketCode: Record<string, string[]> = {
  /**
   * 1000 indicates a normal closure, meaning that the purpose for
      which the connection was established has been fulfilled.
   */
  1000: ["Normal Closure", "websocket已关闭"],
  /**
   *  1001 indicates that an endpoint is "going away", such as a server
      going down or a browser having navigated away from a page.
   */
  1001: ["Going Away", "websocket服务器故障/页面即将关闭"],
  /**
   *  1002 indicates that an endpoint is terminating the connection due
      to a protocol error.
   */
  1002: ["Protocol error", "websocket协议错误"], // terminating
  /**
   * 1003 indicates that an endpoint is terminating the connection
      because it has received a type of data it cannot accept (e.g., an
      endpoint that understands only text data MAY send this if it
      receives a binary message).
   */
  1003: ["Unsupported Data", "websocket无法处理的数据类型"], // terminating
  /**
   *  Reserved.  The specific meaning might be defined in the future.
   */
  1004: ["Reserved", "websocket_Reserved1004"],
  /**
   * 1005 is a reserved value and MUST NOT be set as a status code in a
      Close control frame by an endpoint.  It is designated for use in
      applications expecting a status code to indicate that no status
      code was actually present.
   */
  1005: ["No Status Rcvd", "websocket_Reserved1005"],
  /**
   *1006 is a reserved value and MUST NOT be set as a status code in a
      Close control frame by an endpoint.  It is designated for use in
      applications expecting a status code to indicate that the
      connection was closed abnormally, e.g., without sending or
      receiving a Close control frame.
   */
  1006: ["Abnormal Closure", "websocket连接异常关闭"],
  /**
   *  1007 indicates that an endpoint is terminating the connection
      because it has received data within a message that was not
      consistent with the type of the message (e.g., non-UTF-8 [RFC3629]
      data within a text message).
   */
  1007: ["Invalid frame payload data", "webocket数据异常"], // terminating
  /**
   * 1008 indicates that an endpoint is terminating the connection
      because it has received a message that violates its policy.  This
      is a generic status code that can be returned when there is no
      other more suitable status code (e.g., 1003 or 1009) or if there
      is a need to hide specific details about the policy.

   */
  1008: ["Policy Violation", "websocket消息不符合策略"], // terminating
  /**
   * 1009 indicates that an endpoint is terminating the connection
      because it has received a message that is too big for it to
      process.
   */
  1009: ["Message Too Big", "websocket消息过长"],
  /**
   * 1010 indicates that an endpoint (client) is terminating the
      connection because it has expected the server to negotiate one or
      more extension, but the server didn't return them in the response
      message of the WebSocket handshake.  The list of extensions that
      are needed SHOULD appear in the /reason/ part of the Close frame.
      Note that this status code is not used by the server, because it
      can fail the WebSocket handshake instead.
   */
  1010: ["Mandatory Ext.", "websocket握手失败"], // terminating
  /**
   * 1011 indicates that a server is terminating the connection because
      it encountered an unexpected condition that prevented it from
      fulfilling the request.
   */
  1011: ["Internal Error", "websocket未知错误"], // terminating
  /**
   *The server is terminating the connection because it is restarting.
   */
  1012: ["Service Restart", "websocket服务器重启中"], // terminating
  /**
   * The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients.
   */
  1013: ["Try Again Later", "websocket服务器超载，请稍后重试"], // terminating
  /**
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server. This is similar to 502 HTTP Status Code.
   */
  1014: ["Bad Gateway", "websocket_502 Bad Gateway"],
  /**
   * 1015 is a reserved value and MUST NOT be set as a status code in a
      Close control frame by an endpoint.  It is designated for use in
      applications expecting a status code to indicate that the
      connection was closed due to a failure to perform a TLS handshake
      (e.g., the server certificate can't be verified).
   */
  1015: ["TLS handshake", "websocket_TLS 证书错误"],
}
export const toCN = (code?: number): string => {
  if (!code) {
    return ""
  }
  const so = socketCode[String(code)]
  if (so) {
    return so[1]
  }
  return "未知sip状态码:" + code
}
export const isSocketCode = (code?: number): boolean => {
  return code ? code >= 1000 && code <= 1015 : false
}
