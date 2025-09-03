import { describe, expect, it } from "vitest"
import { isHTTPUrl, isUrl } from "."

describe("shared/misc/is.ts", () => {
  it("[isUrl]", () => {
    expect(isUrl("https://example.com", "https")).toBeTruthy()
    expect(isUrl("https://example.com", /https?/)).toBeTruthy()
    expect(isUrl("https://example.com", "http")).toBeFalsy()
    expect(isUrl("https://example.com")).toBeTruthy()
    expect(isUrl("example.com")).toBeFalsy()
    expect(isUrl("example.com", "http")).toBeFalsy()
    expect(isUrl("example.com", "https")).toBeFalsy()
    expect(isUrl("example.com", /.*/)).toBeFalsy()
  })

  it("[isHTTPUrl]", () => {
    expect(isHTTPUrl("https://example.com")).toBeTruthy()
    expect(isHTTPUrl("http://example.com")).toBeTruthy()
    expect(isHTTPUrl("https:/example.com")).toBeFalsy()
    expect(isHTTPUrl("http:/example.com")).toBeFalsy()
    expect(isHTTPUrl("example.com")).toBeFalsy()
  })
})
