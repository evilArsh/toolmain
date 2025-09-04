import { onBeforeUnmount, ref, shallowReactive, watch, WatchHandle } from "vue"
import hotkeys from "hotkeys-js"
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
export type ShortcutHandler = {
  key: string
  handler: WatchHandle
  queue: PQueue
}
export function useShortcut() {
  const handler = shallowReactive<ShortcutHandler[]>([])
  hotkeys.filter = () => {
    return true
  }
  function cleanAll() {
    handler.forEach(h => {
      h.handler.stop()
      hotkeys.unbind(h.key)
    })
    handler.length = 0
  }
  function clean(key: string) {
    hotkeys.unbind(key)
    const index = handler.findIndex(h => h.key === key)
    if (index === -1) return
    handler[index].handler.stop()
    handler[index].queue.clear()
    handler.splice(index, 1)
  }
  function listen(
    shortcut: string,
    callback: (active: boolean, key: string, ...args: unknown[]) => Promise<void> | void,
    config?: ShortcutOptions
  ) {
    const key = ref(shortcut)
    const queue = new PQueue({ concurrency: 1 })
    const doListen = (key: string) => {
      hotkeys(key, { ...config, keyup: true, capture: true }, (event, handler) => {
        const key = handler.key
        queue.add(async () => callback(event.type === "keydown", key))
      })
    }
    const watchHandler = watch(key, (val, old) => {
      if (old) hotkeys.unbind(old)
      if (!val) return
      doListen(val)
    })
    doListen(key.value)
    handler.push({ key: key.value, handler: watchHandler, queue })
    function trigger(...args: unknown[]) {
      const keyValue = key.value
      if (!keyValue) return
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
    handler,
    cleanAll,
    clean,
    listen,
  }
}
