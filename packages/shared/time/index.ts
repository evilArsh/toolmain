import { useDateFormat, type DateLike } from "@vueuse/core"
import { unref } from "vue"

/**
 * 按照`formatStr`格式化时间，字符串错误时调用`formatSecond`
 */
export function formatTime(time: DateLike, formatStr: string): string {
  try {
    return unref(useDateFormat(time ?? Date.now(), formatStr))
  } catch (_error) {
    return formatSecond(time)
  }
}
/**
 * YYYY
 */
export function formatYear(time: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY"))
}
/**
 * YYYY-MM
 */
export function formatMonth(time: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM"))
}
/**
 * YYYY-MM-DD
 */
export function formatDay(time: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD"))
}
/**
 * YYYY-MM-DD HH
 */
export function formatHour(time: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD HH"))
}
/**
 * YYYY-MM-DD HH:mm
 */
export function formatMinute(time: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD HH:mm"))
}
/**
 * YYYY-MM-DD HH:mm:ss
 */
export function formatSecond(time: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD HH:mm:ss"))
}
