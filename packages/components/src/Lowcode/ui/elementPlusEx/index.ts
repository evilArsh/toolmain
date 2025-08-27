import { ComponentLabel, ComponentLibrary, RawComponent } from "../../types"
import * as ep from "element-plus"
import { Component, h, VNode } from "vue"
import { cloneDeep } from "@toolmain/shared"
import EpLibraryUI from "./views/index.vue"
type MapRaw = { raw: RawComponent; node: VNode | Component }

const modules = import.meta.glob("./components/config/el-*.ts", { eager: true })
const defaultRaw: RawComponent = {
  label: "el-default",
  desc: "element-plus@自定义组件",
  props: {},
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义默认内容",
      props: {},
    },
  },
}
const transformModules = (modules: Record<string, any>, map: Map<string, MapRaw>) => {
  return Object.entries(modules)
    .filter(([path, module]) => path.match(/\/el-[^/]+\.ts$/) && module.default)
    .forEach(([path, module]) => {
      const fileName = path.match(/\/el-([^/]+)\.ts$/)![1]
      const componentName = `El${fileName
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")}`
      const label = `el-${fileName}`
      const node = (ep as Record<string, any>)[componentName] as Component
      map.set(label, {
        raw: module.default as RawComponent,
        node,
      })
    })
}
class EpLibrary implements ComponentLibrary {
  #compMap: Map<string, MapRaw>
  constructor() {
    this.#compMap = new Map()
    transformModules(modules, this.#compMap)
    this.#compMap.set("el-default", { raw: defaultRaw, node: h("i") })
  }
  isPlaceHolder(raw: RawComponent): boolean {
    return raw.label === ComponentLabel.PLACEHOLDER
  }
  getId(): string {
    return "element-plus"
  }
  registerComponent(raw: RawComponent, node: VNode | Component): void {
    if (this.#compMap.has(raw.label)) {
      console.warn(`[registerComponent] duplicate component label in ${this.getId()}`, raw)
    }
    this.#compMap.set(raw.label, { raw: cloneDeep(raw), node })
  }
  getRawConfig(): RawComponent[] {
    return Array.from(this.#compMap.values()).map(({ raw: raw }) => raw)
  }
  getRaw(label: string): RawComponent | undefined {
    return cloneDeep(this.#compMap.get(label)?.raw)
  }
  getDefault(): RawComponent {
    return defaultRaw
  }
  hasComponent(raw: RawComponent): boolean {
    return this.#compMap.has(raw.label)
  }
  getRawNode(raw: RawComponent): VNode | Component | undefined {
    return this.#compMap.get(raw.label)?.node
  }
  isDefault(raw: RawComponent): boolean {
    return raw.label === defaultRaw.label
  }
}
export { EpLibrary, EpLibraryUI }
