export const sipCode: Record<string, string[]> = {
  "0": ["", ""],
  "100": ["Trying", "拨打中"],
  "180": ["Ringing", "响铃中"],
  "181": ["Call Is Being Forwarded", ""],
  "182": ["Queued", ""],
  "183": ["Session Progress", "响铃中"],
  "200": ["OK", ""],
  "300": ["Multiple Choices", "重定向"],
  "301": ["Moved Permanently", "重定向"],
  "302": ["Moved Temporarily", "重定向"],
  "305": ["Use Proxy", "重定向"],
  "380": ["Alternative Service", "重定向"],
  "400": ["Bad Request", ""],
  "401": ["Unauthorized", "用户/密码错误"],
  "402": ["Payment Required", ""],
  "403": ["Forbidden", "服务器拒绝连接"],
  "404": ["Not Found", "用户未找到"],
  "405": ["Method Not Allowed", ""],
  "406": ["Not Acceptable", ""],
  "407": ["Proxy Authentication Required", ""],
  "408": ["Request Timeout", "拨号超时"],
  "410": ["Gone", "未找到"],
  "413": ["Request Entity Too Large", ""],
  "414": ["Request-URI Too Long", ""],
  "415": ["Unsupported Media Type", ""],
  "416": ["Unsupported URI Scheme", ""],
  "420": ["Bad Extension", ""],
  "421": ["Extension Required", ""],
  "423": ["Interval Too Brief", ""],
  "430": ["Unavailable", ""], // https://www.ietf.org/rfc/rfc3261.txt 不存在
  "480": ["Temporarily Unavailable", "未接听/无法接通"], // freeswitch
  "481": ["Call/Transaction Does Not Exist", ""],
  "482": ["Loop Detected", ""],
  "483": ["Too Many Hops", ""],
  "484": ["Address Incomplete", "找不到用户,请检查sip uri"],
  "485": ["Ambiguous", ""],
  "486": ["Busy Here", "用户忙"],
  "487": ["Request Terminated", "用户拒接"], // freeswitch
  "488": ["Not Acceptable Here", ""],
  "491": ["Request Pending", ""],
  "493": ["Undecipherable", ""],
  "500": ["Server Internal Error", ""],
  "501": ["Not Implemented", ""],
  "502": ["Bad Gateway", ""],
  "503": ["Service Unavailable", "无法接通"], // asterisk 空号
  "504": ["Server Time-out", ""],
  "505": ["Version Not Supported", ""],
  "513": ["Message Too Large", ""],
  /**
   * 6xx responses indicate that a server has definitive information about
   * a particular user, not just the particular instance indicated in the
   * Request-URI.
   */
  "600": ["Busy Everywhere", "用户忙"],
  "603": ["Decline", "未接听/拒接/无法接通"],
  "604": ["Does Not Exist Anywhere", "用户未找到"],
  "606": ["Not Acceptable", ""],
}
// export default sipCode
