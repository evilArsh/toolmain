import { RawComponent, ComponentLibrary, ComponentLabel } from "../types"
import { cloneDeep } from "@toolmain/shared"
import { htmlTextLabel, htmlTextConfig } from "./html"
import { placeholderNode, placeholderRaw } from "./placeholder"
import { Component, h, VNode } from "vue"

/**
 * HTML 默认文本组件库
 */
export class GeneralLibrary implements ComponentLibrary {
  #compMap: Map<string, { raw: RawComponent; node: VNode | Component }>
  constructor() {
    this.#compMap = new Map(
      htmlTextLabel.map(label => [label, { raw: htmlTextConfig(label, this.getId()), node: h(label) }])
    )
    this.#compMap.set(ComponentLabel.PLACEHOLDER, { raw: placeholderRaw(), node: placeholderNode() })
  }
  getId(): string {
    return "html"
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
    return htmlTextConfig("div", this.getId())
  }
  hasComponent(raw: RawComponent): boolean {
    return this.#compMap.has(raw.label)
  }
  getRawNode(raw: RawComponent): VNode | Component | undefined {
    return this.#compMap.get(raw.label)?.node
  }
  isDefault(raw: RawComponent): boolean {
    return raw.label === "div"
  }
  isPlaceHolder(raw: RawComponent): boolean {
    return raw.label === ComponentLabel.PLACEHOLDER
  }
}
