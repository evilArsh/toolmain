import { onBeforeUnmount, ref, ShallowReactive, shallowReactive, watch, WatchHandle } from "vue"
import hotkeys from "hotkeys-js"
import PQueue from "p-queue"
import { uniqueId } from "../../misc"

export type ShortcutOptions = {
  // scope?: string
  element?: HTMLElement | null
  keyup?: boolean | null
  keydown?: boolean | null
  capture?: boolean
  splitKey?: string
  single?: boolean
  /**
   * if return false, will prevent from triggering shortcut event
   */
  beforeTrigger?: (event: KeyboardEvent, key: string) => boolean
}
export type ShortcutHandler = {
  id: string
  /**
   * current listening key, the key may be changed dynamically
   */
  key: string
  handler: WatchHandle
  queue: PQueue
}
export function useShortcut() {
  const scope = "use-shortcut-scope"
  const handler: ShallowReactive<ShortcutHandler[]> = shallowReactive<ShortcutHandler[]>([])
  hotkeys.filter = () => {
    return true
  }
  hotkeys.setScope(scope)
  function cleanAll() {
    Array.from(handler.map(h => h.id)).forEach(clean)
    handler.length = 0
  }
  function clean(id: string) {
    const index = handler.findIndex(h => h.id === id)
    if (index === -1) return
    hotkeys.unbind(handler[index].key, scope)
    handler[index].handler.stop()
    handler[index].queue.clear()
    handler.splice(index, 1)
  }
  function listen(
    shortcut: string,
    callback: (active: boolean, key: string, ...args: unknown[]) => Promise<void> | void,
    config?: ShortcutOptions
  ) {
    const id = uniqueId()
    const key = ref(shortcut)
    const queue = new PQueue({ concurrency: 1 })
    const listen = (val: string, old?: string) => {
      if (!val) return
      if (val === old) return
      const current = handler.find(h => h.id === id)
      if (!current) return
      current.key = val
      if (old) hotkeys.unbind(old, scope)
      hotkeys(val, { ...config, keyup: true, capture: true, scope }, (event, handler) => {
        const key = handler.key
        if (config?.beforeTrigger && !config.beforeTrigger(event, key)) {
          return
        }
        queue.add(async () => callback(event.type === "keydown", key))
      })
    }
    const watcher = watch(key, listen)
    handler.push({
      id,
      key: key.value,
      handler: watcher,
      queue,
    })
    listen(key.value)
    function trigger(...args: unknown[]) {
      const keyValue = key.value
      if (!keyValue) return
      queue.add(async () => callback(true, keyValue, ...args))
    }
    return {
      id,
      key,
      trigger,
    }
  }
  function pause() {}
  function resume() {}
  onBeforeUnmount(() => {
    cleanAll()
  })
  return {
    handler,
    cleanAll,
    clean,
    listen,
    resume,
    pause,
  }
}
