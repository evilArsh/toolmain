export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  /**
   * extra status code for `request abort`
   */
  RequestAbort = 499,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}
export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK"

export type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text" | "stream" | "formdata"

export type responseEncoding =
  | "ascii"
  | "ASCII"
  | "ansi"
  | "ANSI"
  | "binary"
  | "BINARY"
  | "base64"
  | "BASE64"
  | "base64url"
  | "BASE64URL"
  | "hex"
  | "HEX"
  | "latin1"
  | "LATIN1"
  | "ucs-2"
  | "UCS-2"
  | "ucs2"
  | "UCS2"
  | "utf-8"
  | "UTF-8"
  | "utf8"
  | "UTF8"
  | "utf16le"
  | "UTF16LE"

export enum ContentType {
  TextPlain = "text/plain; charset=utf-8",
  TextHtml = "text/html; charset=utf-8",
  TextCss = "text/css; charset=utf-8",
  TextJavascript = "text/javascript; charset=utf-8",
  TextCsv = "text/csv; charset=utf-8",
  TextXml = "text/xml; charset=utf-8",
  TextMarkdown = "text/markdown; charset=utf-8",

  ImageJpeg = "image/jpeg",
  ImagePng = "image/png",
  ImageGif = "image/gif",
  ImageSvg = "image/svg+xml",
  ImageWebp = "image/webp",
  ImageIco = "image/x-icon",

  ApplicationJson = "application/json; charset=utf-8",
  ApplicationXml = "application/xml; charset=utf-8",
  ApplicationPdf = "application/pdf",
  ApplicationZip = "application/zip",
  ApplicationOctetStream = "application/octet-stream",
  ApplicationXWwwFormUrlencoded = "application/x-www-form-urlencoded",
  ApplicationFormData = "multipart/form-data",
  ApplicationJavascript = "application/javascript; charset=utf-8",
  ApplicationWasm = "application/wasm",

  AudioMpeg = "audio/mpeg",
  AudioOgg = "audio/ogg",
  AudioWav = "audio/wav",
  AudioWebm = "audio/webm",
  VideoMp4 = "video/mp4",
  VideoOgg = "video/ogg",
  VideoWebm = "video/webm",
  VideoMpeg = "video/mpeg",

  FontTtf = "font/ttf",
  FontWoff = "font/woff",
  FontWoff2 = "font/woff2",
}

/**
 * 通用响应格式
 */
export interface Response<T = unknown> {
  code: HttpStatusCode
  msg: string
  data: T
}
export type StatusResponse = Response<undefined>

/**
 * 将数据组装成以下格式:
 * ```js
 * {
 *  code: HttpStatusCode,
 *  msg: string,
 * }
 * ```
 */
export function responseCode(code: HttpStatusCode, msg?: string): StatusResponse {
  return {
    code,
    msg: msg ?? "",
    data: undefined,
  }
}
/**
 * 将数据组装成以下格式:
 * ```js
 * {
 *  code: HttpStatusCode,
 *  msg: string,
 *  data: T
 * }
 * ```
 */
export function responseData<T>(code: HttpStatusCode, msg: string, data: T): Response<T> {
  return { code, msg, data }
}
/**
 * 判断`code` 是否处于 [100,200) 区间
 */
export function code1xx(code: HttpStatusCode | number) {
  return code >= 100 && code < 200
}
/**
 * 判断`code` 是否处于 [200,300) 区间
 */
export function code2xx(code: HttpStatusCode | number) {
  return code >= 200 && code < 300
}
/**
 * 判断`code` 是否处于 [300,400) 区间
 */
export function code3xx(code: HttpStatusCode | number) {
  return code >= 300 && code < 400
}
/**
 * 判断`code` 是否处于 [400,500) 区间
 */
export function code4xx(code: HttpStatusCode | number) {
  return code >= 400 && code < 500
}
/**
 * 判断`code` 是否处于 [500,511] 区间
 */
export function code5xx(code: HttpStatusCode | number) {
  return code >= 500 && code <= 511
}
