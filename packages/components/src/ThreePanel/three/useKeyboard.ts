import { useEvent } from "@toolmain/shared"

export enum KeyCode {
  init = "KEYBOARD:INIT",
  keydown = "KEYBOARD:KEYDOWN",
  keyup = "KEYBOARD:KEYUP",
  keyStatus = "KEYBOARD:KEYSTATUS",

  KeyWA = "KeyWA",
  KeyWD = "KeyWD",
  KeyAS = "KeyAS",
  KeySD = "KeySD",
  ShiftLeft = "ShiftLeft",
  Space = "Space",

  KeyW = "KeyW",
  KeyA = "KeyA",
  KeyS = "KeyS",
  KeyD = "KeyD",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
}
export function useKeyboard() {
  const ev = useEvent()
  ev.removeAllListeners()
  const keys: Record<string, boolean> = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
  }
  const hotKeycodeSet = new Set<string>()
  function _emitCombineKeyStatus() {
    ev.emit(KeyCode.KeyWA, keys.KeyW && keys.KeyA)
    ev.emit(KeyCode.KeyWD, keys.KeyW && keys.KeyD)
    ev.emit(KeyCode.KeyAS, keys.KeyA && keys.KeyS)
    ev.emit(KeyCode.KeySD, keys.KeyS && keys.KeyD)
  }
  function onKeyDownCallback(e: KeyboardEvent) {
    keys[e.code] = true
    hotKeycodeSet.add(e.code)
    ev.emit(KeyCode.keydown, Array.from(hotKeycodeSet))
    ev.emit(e.code, !!keys[e.code])
    _emitCombineKeyStatus()
  }
  function onKeyUpCallback(e: KeyboardEvent) {
    keys[e.code] = false
    hotKeycodeSet.delete(e.code)
    ev.emit(KeyCode.keyup, Array.from(hotKeycodeSet))
    ev.emit(e.code, !!keys[e.code])
    _emitCombineKeyStatus()
  }
  function init() {
    document.addEventListener("keydown", onKeyDownCallback)
    document.addEventListener("keyup", onKeyUpCallback)
  }
  function dispose() {
    document.removeEventListener("keydown", onKeyDownCallback)
    document.removeEventListener("keyup", onKeyUpCallback)
  }
  return {
    ev,
    init,
    dispose,
  }
}
