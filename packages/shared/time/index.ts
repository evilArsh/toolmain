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
 * 将时间格式化为：YYYY
 *
 * 如果不传值默认格式此刻
 */
export function formatYear(time?: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY"))
}
/**
 * 将时间格式化为：YYYY-MM
 *
 * 如果不传值默认格式此刻
 */
export function formatMonth(time?: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM"))
}
/**
 * 将时间格式化为：YYYY-MM-DD
 *
 * 如果不传值默认格式此刻
 */
export function formatDay(time?: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD"))
}
/**
 * 将时间格式化为：YYYY-MM-DD HH
 *
 * 如果不传值默认格式此刻
 */
export function formatHour(time?: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD HH"))
}
/**
 * 将时间格式化为：YYYY-MM-DD HH:mm
 *
 * 如果不传值默认格式此刻
 */
export function formatMinute(time?: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD HH:mm"))
}
/**
 * 将时间格式化为：YYYY-MM-DD HH:mm:ss
 *
 * 如果不传值默认格式此刻
 */
export function formatSecond(time?: DateLike): string {
  return unref(useDateFormat(time ?? Date.now(), "YYYY-MM-DD HH:mm:ss"))
}
