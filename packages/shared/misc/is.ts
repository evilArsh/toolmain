const objectToString = Object.prototype.toString
const toTypeString = (value: unknown): string => objectToString.call(value)
export const isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === "[object Map]"
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === "[object Set]"
export const isDate = (val: unknown): val is Date => toTypeString(val) === "[object Date]"
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === "[object RegExp]"
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (val: unknown): val is Function => typeof val === "function"
export const isString = (val: unknown): val is string => typeof val === "string"
export const isNumber = (val: unknown): val is number => typeof val === "number" && !isNaN(val)
export const isSymbol = (val: unknown): val is symbol => typeof val === "symbol"
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === "object"
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
export const isUndefined = (val: unknown): val is undefined => typeof val === "undefined"
export const isBoolean = (val: unknown): val is boolean => typeof val === "boolean"

export const isValidHttpUrl = (url: string): boolean => {
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch (_e) {
    return false
  }
}
export const isBase64Image = (str: string) => {
  return /^data:image\/(png|jpe?g|gif|webp|svg\+xml|x-icon|bmp|tiff);base64,([a-zA-Z0-9+/]+={0,2})$/i.test(str)
}
