import { describe, expect, it } from "vitest"
import { formatTime } from "."

describe("shared/misc/time.ts", () => {
  it("[formatTime]", () => {
    const date = Date.parse("2025-12-31")
    expect(formatTime(date, "YYYY-MM-DD")).equal("2025-12-31")
  })
})
