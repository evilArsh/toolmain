import { VNode } from "vue"

export type ComponentUIGroup = {
  label: string
  list: Array<{
    label: string
    icon?: string | VNode
  }>
}
