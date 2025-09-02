import { describe, expect, it } from "vitest"
import { useShortcut } from "."
import { useSetup } from "../../../.test"

describe("useShortcut", () => {
  it("should return width and height of element", async () => {
    const vm = useSetup(() => {
      const { clean, cleanAll, listen } = useShortcut()
      listen("a", () => {})
    })
    // expect(events).not.toEqual(emptyMap)
    // vm.unmount()
    // await nextTick()
    // expect(events).toEqual(emptyMap)
  })
})
