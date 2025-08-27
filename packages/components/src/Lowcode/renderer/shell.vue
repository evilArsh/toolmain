<template>
  <div class="shell contents" ref="shadowRef">
    <component :is="component" v-bind="$attrs" ref="childRef">
      <template v-for="(_, name) in $slots" #[name]="slotProps: SlotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </component>
  </div>
</template>

<script lang="ts" setup>
import { type Component, type VNode, useTemplateRef, shallowRef, ref, onBeforeUnmount, onMounted } from "vue"
import { ComponentProvider, DeliverParam } from "../types"
type SlotProps = Record<string, unknown> | undefined

const props = defineProps<{
  component: Component | VNode | string
  instanceId: string
  provider?: ComponentProvider
}>()

const shadowRef = useTemplateRef("shadowRef")
// 子元素的引用：可以调用组件expose的方法
const childRef = shallowRef<unknown>()
// 子元素HTML node：用于获取子元素尺寸
const childEl = shallowRef<HTMLElement>()

const currentInstanceId = ref<string | null>(null)

/**
 * 判断instanceId是否有效：
 * 1. provider存在
 * 2. 组件库存在
 * 3. 组件存在
 * 4. 非默认组件和占位组件
 */
const effectiveInstance = (instanceId: string): boolean => {
  if (!props.provider) return false
  const data = props.provider.getNodeTree().findByInstanceId(instanceId)
  if (data) {
    const lib = props.provider.getLibrary(data.libraryId)
    return !!lib && !(lib.isDefault(data.raw) || lib.isPlaceHolder(data.raw))
  }
  return false
}

const listener = {
  click: (e: MouseEvent) => {
    if (!effectiveInstance(props.instanceId)) return
    currentInstanceId.value = props.instanceId
    props.provider?.emit("InstanceClick", { instanceId: props.instanceId })
    e.stopPropagation()
  },
  contextmenu: (e: MouseEvent) => {
    if (!effectiveInstance(props.instanceId)) return
    currentInstanceId.value = props.instanceId
    props.provider?.emit("InstanceContextmenu", { instanceId: props.instanceId })
    e.stopPropagation()
    e.preventDefault()
  },
  // instance被动触发
  drop: (e: DragEvent) => {
    const src = props.provider?.getCurrent()
    if (src) {
      const dst: DeliverParam = { instanceId: props.instanceId }
      props.provider?.emit("InstanceDrop", { src, dst })
    } else {
      console.warn("[onDrop]", `no src node found when dropped to ${props.instanceId}`)
    }
    e.stopPropagation()
  },
  dragover: (e: MouseEvent) => {
    if (!effectiveInstance(props.instanceId)) return
    // console.log("[dragover]", props.instanceId)
    // requestAnimationFrame(() => {
    //   props.provider?.emit("InstanceDragover", { instanceId: props.instanceId })
    // })
    e.preventDefault()
    e.stopPropagation()
  },
  dragenter: (e: DragEvent) => {
    if (!effectiveInstance(props.instanceId)) return
    // console.log("[dragenter]", props.instanceId)
    props.provider?.emit("InstanceDragenter", {
      instanceId: props.instanceId,
      clientX: e.clientX,
      clientY: e.clientY,
    })
    e.stopPropagation()
  },
  dragleave: (e: DragEvent) => {
    if (!effectiveInstance(props.instanceId)) return
    // console.log("[dragleave]", props.instanceId)
    props.provider?.emit("InstanceDragleave", { instanceId: props.instanceId })
    e.stopPropagation()
  },
  // instance主动触发
  dragstart: (e: DragEvent) => {
    // console.log("[dragstart]", props.instanceId)
    const src: DeliverParam = { instanceId: props.instanceId }
    props.provider?.emit("InstanceDragstart", src)
    props.provider?.setCurrent(src)
    e.stopPropagation()
  },
  dragend: (e: DragEvent) => {
    // console.log("[dragend]", props.instanceId)
    props.provider?.emit("InstanceDragend", { instanceId: props.instanceId })
    e.stopPropagation()
  },
}
function mounted() {
  if (shadowRef.value) {
    childEl.value = shadowRef.value.firstElementChild as HTMLElement
    childEl.value.setAttribute("data-component-id", props.instanceId)

    childEl.value.addEventListener("click", listener.click)
    childEl.value.addEventListener("contextmenu", listener.contextmenu)
    childEl.value.addEventListener("dragstart", listener.dragstart)
    childEl.value.addEventListener("dragover", listener.dragover)
    childEl.value.addEventListener("drop", listener.drop)
    childEl.value.addEventListener("dragend", listener.dragend)
    childEl.value.addEventListener("dragenter", listener.dragenter)
    childEl.value.addEventListener("dragleave", listener.dragleave)
  }
}
function beforeUnmount() {
  childEl.value?.removeEventListener("click", listener.click)
  childEl.value?.removeEventListener("contextmenu", listener.contextmenu)
  childEl.value?.removeEventListener("dragstart", listener.dragstart)
  childEl.value?.removeEventListener("dragover", listener.dragover)
  childEl.value?.removeEventListener("drop", listener.drop)
  childEl.value?.removeEventListener("dragend", listener.dragend)
  childEl.value?.removeEventListener("dragenter", listener.dragenter)
  childEl.value?.removeEventListener("dragleave", listener.dragleave)
}
onMounted(mounted)
onBeforeUnmount(beforeUnmount)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
