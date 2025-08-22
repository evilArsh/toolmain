import { type VNode, VNodeProps, cloneVNode, h, isVNode, mergeProps, onMounted, render, shallowRef } from "vue"

export const useElement = <T extends Record<string, unknown> & VNodeProps>(node?: VNode) => {
  const el = shallowRef<HTMLElement>(document.createElement("div"))
  const vnode = shallowRef<VNode | undefined>(node)
  let props: T | undefined = {} as T
  function update(node: VNode, prop?: T) {
    props = prop
    vnode.value = isVNode(node) ? cloneVNode(node, prop) : h(node, prop)
    render(vnode.value, el.value)
  }
  function updateProps(prop: T) {
    if (!vnode.value) return
    if (!props) props = prop
    update(vnode.value, mergeProps(props, prop) as T)
  }

  onMounted(() => {
    if (vnode.value) {
      update(vnode.value)
    }
  })
  return {
    el,
    update,
    updateProps,
  }
}
