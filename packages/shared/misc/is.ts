const objectToString = Object.prototype.toString
const toTypeString = (value: unknown): string => objectToString.call(value)
/**
 * 判断是否是数组
 */
export const isArray = Array.isArray
/**
 * 判断是否是`Map`
 */
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === "[object Map]"
/**
 * 判断是否是`Set`
 */
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === "[object Set]"
/**
 * 判断是否是`Date`
 */
export const isDate = (val: unknown): val is Date => toTypeString(val) === "[object Date]"
/**
 * 判断是否是`RegExp`
 */
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === "[object RegExp]"
/**
 * 判断是否是`function`
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (val: unknown): val is Function => typeof val === "function"
/**
 * 判断是否是`string`
 */
export const isString = (val: unknown): val is string => typeof val === "string"
/**
 * 判断是否是数字,`NaN`返回`false`
 */
export const isNumber = (val: unknown): val is number => typeof val === "number" && !isNaN(val)
/**
 * 判断是否是`Symbol`
 */
export const isSymbol = (val: unknown): val is symbol => typeof val === "symbol"
/**
 * 判断是否是`Object`
 */
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === "object"
/**
 * 判断是否是`Promise`
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
/**
 * 判断是否是`undefined`
 */
export const isUndefined = (val: unknown): val is undefined => typeof val === "undefined"
/**
 * 判断是否是`boolean`
 */
export const isBoolean = (val: unknown): val is boolean => typeof val === "boolean"

/**
 * 验证是否是合法的http url
 */
export const isValidHttpUrl = (url: string): boolean => {
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch (_e) {
    return false
  }
}
/**
 * 判断是否是base64图片
 */
export const isBase64Image = (str: string) => {
  return /^data:image\/(png|jpe?g|gif|webp|svg\+xml|x-icon|bmp|tiff);base64,([a-zA-Z0-9+/]+={0,2})$/i.test(str)
}
