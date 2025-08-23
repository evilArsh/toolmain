import { onBeforeUnmount, ref, watch, WatchHandle } from "vue"
import hotkeys from "hotkeys-js"

export function useShortcut() {
  const handler: Array<{ key: string; handler: WatchHandle }> = []
  hotkeys.filter = () => {
    return true
  }
  function cleanAll() {
    handler.forEach(h => {
      hotkeys.unbind(h.key)
      h.handler.stop()
    })
  }
  function clean(key: string) {
    hotkeys.unbind(key)
    const index = handler.findIndex(h => h.key === key)
    if (index === -1) return
    handler[index].handler.stop()
    handler.splice(index, 1)
  }
  function listen(shortcut: string, callback: (active: boolean, key: string, ...args: unknown[]) => void) {
    const key = ref(shortcut)
    const watchHandler = watch(
      key,
      (val, old) => {
        if (old) clean(old)
        hotkeys(
          val,
          {
            keyup: true,
            capture: true,
            // single: true,
          },
          (event, handler) => {
            callback(event.type === "keydown", handler.key)
          }
        )
      },
      { immediate: true }
    )
    handler.push({
      key: key.value,
      handler: watchHandler,
    })
    function trigger(...args: unknown[]) {
      callback(true, key.value, ...args)
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
