import { defineStore } from "pinia"
import { type VNode, type Component, reactive } from "vue"

export interface DebugPanel {
  id: string
  label: string
  node: VNode | Component | string
}
/**
 * 动态增加debugger 面板
 */
export default defineStore("use-debugger", () => {
  const panels = reactive<DebugPanel[]>([])

  function addPanel(conf: DebugPanel) {
    const panel = panels.find(v => v.id === conf.id)
    if (panel) {
      panel.label = conf.label
      panel.node = conf.node
    } else {
      panels.push({ ...conf })
    }
  }
  return {
    panels,
    addPanel,
  }
})
