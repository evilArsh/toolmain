import { merge } from "@toolmain/shared"
import { DialogEmits, DialogPropsPublic } from "element-plus"
import { Reactive, reactive, ShallowRef, shallowRef } from "vue"

export type Writable<T> = {
  -readonly [K in keyof T]: T[K]
}
export interface DialogReturn {
  props: Reactive<DialogPropsPublic>
  event: ShallowRef<DialogEmits>
  close: () => void
  open: () => void
}
export function useDialog(preset?: DialogPropsPublic): DialogReturn {
  const initial: DialogPropsPublic = {
    modelValue: false,
    title: "",
    width: "50%",
    appendToBody: true,
    destroyOnClose: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: true,
    modal: true,
    center: false,
    draggable: true,
    overflow: true,
    showClose: true,
  }
  const props = reactive<Partial<Writable<DialogPropsPublic>>>(merge(initial, preset))
  const event = shallowRef<DialogEmits>({
    open: (): boolean => true,
    opened: (): boolean => true,
    close: (): boolean => true,
    closed: (): boolean => true,
    "update:modelValue": (value: boolean): boolean => {
      props.modelValue = value
      return true
    },
    openAutoFocus: (): boolean => true,
    closeAutoFocus: (): boolean => true,
  })
  function open() {
    props.modelValue = true
  }
  function close() {
    props.modelValue = false
  }
  return {
    props,
    event,
    open,
    close,
  }
}
