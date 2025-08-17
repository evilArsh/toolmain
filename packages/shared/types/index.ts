import type * as CSS from "csstype"

export interface CSSProperties extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {
  // for css variable
  [v: `--${string}`]: string | number | undefined
}

export type ArrMutKeys = "splice" | "push" | "pop" | "shift" | "unshift"
/**
 * 定长数组类型
 */
export type FixedArray<T, L extends number> = Pick<T[], Exclude<keyof T[], ArrMutKeys>> & {
  readonly length: L
}

export interface CallBack {
  callback: (...arg: any[]) => void
}
export type CallBackFn = (...arg: any[]) => void
export type AsyncCallBackFn = (...arg: any[]) => Promise<void>

export interface BridgeResponse<T = unknown> {
  code: HttpStatusCode
  msg: string
  data: T
}
export type BridgeStatusResponse = BridgeResponse<undefined>

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
