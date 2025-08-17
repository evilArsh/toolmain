import { AxiosError } from "axios"
import { serializeError } from "serialize-error"
import _merge from "lodash.merge"
import { isNumber, isString } from "../is"
export function errorToText(error: unknown): string {
  if (typeof error === "string" || typeof error === "number") {
    return String(error)
  }
  if (error instanceof AxiosError) {
    return JSON.stringify(error.response?.data) ?? error.message
  } else {
    if (error instanceof Error && error.message) {
      return error.message
    }
    const e = serializeError(error)
    return JSON.stringify(e)
  }
}

export const merge = _merge

export function px(value: string | number | undefined) {
  if (!value) {
    return "0"
  }
  if (isString(value)) {
    return value
  }
  return value + "px"
}

export function toNumber(value: string | number | undefined): number {
  if (typeof value === "undefined") {
    return 0
  }
  if (isNumber(value)) {
    return value
  } else {
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }
}
