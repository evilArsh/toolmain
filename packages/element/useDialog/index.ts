import { merge } from "@toolman/shared"
import { DialogEmits, DialogProps } from "element-plus"
import { reactive, ref } from "vue"

type Writable<T> = {
  -readonly [K in keyof T]: T[K]
}
export default function (preset?: Partial<Writable<DialogProps>>) {
  const initial: Partial<Writable<DialogProps>> = {
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
    showClose: false,
  }
  const data = reactive<Partial<Writable<DialogProps>>>(merge(initial, preset))
  const event = ref<DialogEmits>({
    open: (): boolean => true,
    opened: (): boolean => true,
    close: (): boolean => true,
    closed: (): boolean => true,
    "update:modelValue": (value: boolean): boolean => {
      data.modelValue = value
      return true
    },
    openAutoFocus: (): boolean => true,
    closeAutoFocus: (): boolean => true,
  })
  function open() {
    data.modelValue = true
  }
  function close() {
    data.modelValue = false
  }
  return {
    dlgProps: data,
    dlgEvent: event,
    open,
    close,
  }
}
