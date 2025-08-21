import { describe, expect, it } from "vitest"
import { cloneDeep, errorToText, px, resolvePath, toNumber } from "."
import { AxiosError, AxiosRequestHeaders } from "axios"

describe("shared/misc/index.ts", () => {
  it("[cloneDeep] Object", () => {
    const obj = {
      a: 1,
      b: { b1: 2 },
      c: [1, 2, 3],
      d: {
        d1: [1, 2, 3],
      },
      e: () => {},
    }
    const objCloned = cloneDeep(obj)
    expect(objCloned.b).not.toBe(obj.b)
    expect(objCloned.c).not.toBe(obj.c)
    expect(objCloned.d).not.toBe(obj.d)
    expect(objCloned.d.d1).not.toBe(obj.d.d1)
    expect(objCloned.e).toBe(obj.e)
    expect(objCloned).not.toBe(obj)
  })
  it("[cloneDeep] Array", () => {
    const obj = [{ a: 1, b: 2, c: 3 }, [1, 2, 3]]
    const objCloned = cloneDeep(obj)
    obj.forEach((val, index) => {
      expect(objCloned[index]).not.toBe(val)
    })
    expect(objCloned).not.toBe(obj)
  })

  it("[errorToText]", () => {
    const errorObj = {
      code: 200,
      msg: "error happened",
      data: { a: 1, b: 2 },
    }
    const errorObjStr = JSON.stringify(errorObj)

    expect(errorToText(new Error("test"))).toBe("test")
    expect(errorToText(new Error(""))).toBe("")
    expect(errorToText(new Error())).toBe("")
    expect(errorToText("string")).toBe("string")
    expect(errorToText(123)).toBe("123")
    expect(errorToText(null)).toBe("null")
    expect(errorToText(undefined)).toBe("undefined")
    expect(errorToText(Symbol(123))).toBe("Symbol(123)")
    expect(
      errorToText(
        new AxiosError("test", "500", undefined, undefined, {
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          config: {
            headers: {} as AxiosRequestHeaders,
          },
          data: errorObj,
        })
      )
    ).toBe(errorObjStr)
    expect(
      errorToText(
        new AxiosError("test", "500", undefined, undefined, {
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          config: {
            headers: {} as AxiosRequestHeaders,
          },
          data: undefined,
        })
      )
    ).toBe("test")
    expect(
      errorToText(
        new AxiosError(undefined, "500", undefined, undefined, {
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          config: {
            headers: {} as AxiosRequestHeaders,
          },
          data: undefined,
        })
      )
    ).toBe("Internal Server Error")
  })

  it("[px]", () => {
    expect(px("10")).toBe("10px")
    expect(px(10)).toBe("10px")
    expect(px("10px")).toBe("10px")
    expect(px("qweasdzxc10px")).toBe("0")
    expect(px()).toBe("0")
    expect(px(NaN)).toBe("0")
  })

  it("[toNumber]", () => {
    expect(toNumber("10")).toBe(10)
    expect(toNumber(10)).toBe(10)
    expect(toNumber()).toBe(0)
    expect(toNumber("qweasdzxc10px")).toBe(0)
    expect(toNumber()).toBe(0)
    expect(toNumber(NaN)).toBe(0)
  })

  it("[resolvePath]", () => {
    expect(resolvePath("foo/bar")).toBe("/foo/bar")
    expect(resolvePath("/", true, true)).toBe("/")
    expect(resolvePath("/", false, true)).toBe("/")
    expect(resolvePath("/", true, false)).toBe("/")
    expect(resolvePath("/", false, false)).toBe("")
    expect(resolvePath("", true, true)).toBe("/")
    expect(resolvePath("", false, true)).toBe("/")
    expect(resolvePath("", true, false)).toBe("/")
    expect(resolvePath("", false, false)).toBe("")
    expect(resolvePath("foo/bar", false, false)).toBe("foo/bar")
    expect(resolvePath("foo/bar", true, true)).toBe("/foo/bar/")
    expect(resolvePath("foo/bar", false, true)).toBe("foo/bar/")
    expect(resolvePath("foo/bar", true, false)).toBe("/foo/bar")
    expect(resolvePath("foo/bar", false, false)).toBe("foo/bar")
    expect(resolvePath("foo///bar", true, true)).toBe("/foo/bar/")
    expect(resolvePath("foo///bar", false, true)).toBe("foo/bar/")
    expect(resolvePath("foo///bar", true, false)).toBe("/foo/bar")
    expect(resolvePath("foo///bar", false, false)).toBe("foo/bar")
    expect(resolvePath("/foo///bar", true, true)).toBe("/foo/bar/")
    expect(resolvePath("/foo///bar", false, true)).toBe("foo/bar/")
    expect(resolvePath("/foo///bar", true, false)).toBe("/foo/bar")
    expect(resolvePath("/foo///bar", false, false)).toBe("foo/bar")
    expect(resolvePath("/foo///bar/", true, true)).toBe("/foo/bar/")
    expect(resolvePath("/foo///bar/", false, true)).toBe("foo/bar/")
    expect(resolvePath("/foo///bar/", true, false)).toBe("/foo/bar")
    expect(resolvePath("/foo///bar/", false, false)).toBe("foo/bar")
    expect(resolvePath("//foo///bar//", true, true)).toBe("/foo/bar/")
    expect(resolvePath("//foo///bar//", false, true)).toBe("foo/bar/")
    expect(resolvePath("//foo///bar//", true, false)).toBe("/foo/bar")
    expect(resolvePath("//foo///bar//", false, false)).toBe("foo/bar")
    expect(resolvePath("https://text.com", true, true)).toBe("https://text.com/")
    expect(resolvePath("https://text.com", false, true)).toBe("https://text.com/")
    expect(resolvePath("https://text.com", true, false)).toBe("https://text.com")
    expect(resolvePath("https://text.com", false, false)).toBe("https://text.com")
    expect(resolvePath("https://text.com/", true, true)).toBe("https://text.com/")
    expect(resolvePath("https://text.com/", false, true)).toBe("https://text.com/")
    expect(resolvePath("https://text.com/", true, false)).toBe("https://text.com")
    expect(resolvePath("https://text.com/", false, false)).toBe("https://text.com")
    expect(resolvePath("/https://text.com/", true, true)).toBe("/https:/text.com/")
    expect(resolvePath("/https://text.com/", false, true)).toBe("https:/text.com/")
    expect(resolvePath("/https://text.com/", true, false)).toBe("/https:/text.com")
    expect(resolvePath("/https://text.com/", false, false)).toBe("https:/text.com")
    expect(resolvePath(["foo", "bar"], true, true)).toBe("/foo/bar/")
    expect(resolvePath(["foo", "bar"], false, true)).toBe("foo/bar/")
    expect(resolvePath(["foo", "bar"], true, false)).toBe("/foo/bar")
    expect(resolvePath(["foo", "bar"], false, false)).toBe("foo/bar")
  })
})
