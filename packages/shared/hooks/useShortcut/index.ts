import { onBeforeUnmount, readonly, ref, ShallowReactive, shallowReactive, watch, WatchHandle } from "vue"
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
  function listen(
    shortcut: string,
    callback: (active: boolean, key: string, ...args: unknown[]) => Promise<void> | void,
    config?: ShortcutOptions
  ) {
    const id = uniqueId()
    const key = ref(shortcut)
    const queue = new PQueue({ concurrency: 1 })
    const taskCount = ref(0)

    const taskPending = ref(false)

    queue.addListener("idle", () => {
      taskPending.value = false
      taskCount.value = 0
    })
    // Emitted every time the add method is called and the number of pending or queued tasks is increased.
    queue.addListener("add", () => {
      taskPending.value = true
      taskCount.value++
    })
    // Emitted as each item is processed in the queue for the purpose of tracking progress.
    queue.addListener("active", () => {
      taskPending.value = true
    })
    // Emitted every time a task is completed and the number of pending or queued tasks is decreased.
    // This is emitted regardless of whether the task completed normally or with an error.
    queue.addListener("next", () => {
      taskCount.value = Math.max(0, taskCount.value - 1)
    })
    const keyListener = (val: string, old?: string) => {
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
    const watcher = watch(key, keyListener)
    handler.push({
      id,
      key: key.value,
      handler: watcher,
      queue,
    })
    keyListener(key.value)
    function trigger(...args: unknown[]) {
      const keyValue = key.value
      if (!keyValue) return
      queue.add(async () => callback(true, keyValue, ...args))
    }
    return {
      id,
      key,
      trigger,
      taskCount: readonly(taskCount),
      /**
       * `false` means that all tasks were finished, includes empty task queue and no pending task
       */
      taskPending: readonly(taskPending),
    }
  }
  function cleanAll() {
    Array.from(handler.map(h => h.id)).forEach(clean)
    handler.length = 0
  }
  function clean(id: string) {
    const index = handler.findIndex(h => h.id === id)
    if (index === -1) return
    hotkeys.unbind(handler[index].key, scope)
    handler[index].handler.stop()
    handler[index].queue.removeAllListeners()
    handler[index].queue.clear()
    handler.splice(index, 1)
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
