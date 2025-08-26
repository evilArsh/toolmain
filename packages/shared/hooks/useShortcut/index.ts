import { onBeforeUnmount, ref, watch, WatchHandle } from "vue"
import hotkeys from "hotkeys-js"
import { merge } from "@toolmain/shared"
import PQueue from "p-queue"

export type ShortcutOptions = {
  scope?: string
  element?: HTMLElement | null
  keyup?: boolean | null
  keydown?: boolean | null
  capture?: boolean
  splitKey?: string
  single?: boolean
}
export function useShortcut() {
  let handler: Array<{ key: string; handler: WatchHandle }> = []
  const queue = new PQueue({ concurrency: 1 })
  hotkeys.filter = () => {
    return true
  }
  function cleanAll() {
    handler.forEach(h => {
      hotkeys.unbind(h.key)
      h.handler.stop()
    })
    handler = []
  }
  function clean(key: string) {
    hotkeys.unbind(key)
    const index = handler.findIndex(h => h.key === key)
    if (index === -1) return
    handler[index].handler.stop()
    handler.splice(index, 1)
  }
  function listen(
    shortcut: string,
    callback: (active: boolean, key: string, ...args: unknown[]) => Promise<void> | void,
    config?: ShortcutOptions
  ) {
    const key = ref(shortcut)
    const watchHandler = watch(
      key,
      (val, old) => {
        if (old) {
          queue.clear()
          clean(old)
        }
        hotkeys(val, merge({}, config, { keyup: true, capture: true }), (event, handler) => {
          const key = handler.key
          queue.add(async () => callback(event.type === "keydown", key))
        })
      },
      { immediate: true }
    )
    handler.push({
      key: key.value,
      handler: watchHandler,
    })
    function trigger(...args: unknown[]) {
      const keyValue = key.value
      queue.add(async () => callback(true, keyValue, ...args))
    }
    return {
      key,
      trigger,
    }
  }
  onBeforeUnmount(() => {
    cleanAll()
  })
  return {
    cleanAll,
    clean,
    listen,
  }
}
