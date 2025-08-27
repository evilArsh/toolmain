import { PropsGeneratorImpl } from "../props/parser"
import { parseProps, registerEvents, parseProp } from "../props/utils"
import { PropsGenerator, Props } from "../types"
import { BaseComponent, ComponentLabel, ComponentProvider, RawComponent } from "./types"
import { uniqueId } from "@toolmain/shared"
import { h, isVNode, VNode } from "vue"
import { placeholderRaw } from "./placeholder"
import Shell from "../renderer/shell.vue"
export class ComponentGenerator {
  #provider: ComponentProvider
  #propsGenerator: PropsGenerator
  constructor(provider: ComponentProvider) {
    this.#provider = provider
    this.#propsGenerator = new PropsGeneratorImpl()
  }
  generate(raw: RawComponent): BaseComponent | undefined {
    const libs = this.#provider.getLibraries().filter(v => v.hasComponent(raw))
    if (libs.length > 1) {
      console.warn("[ComponentGenerator]", "find multiple component libraries", raw, libs)
    }
    const lib = libs.length >= 1 ? libs[0] : undefined
    if (lib) {
      if (lib.isPlaceHolder(raw)) {
        if (Object.keys(raw.props).length === 0) {
          const p = lib.getRaw(ComponentLabel.PLACEHOLDER)
          raw.props = p ? p.props : placeholderRaw().props
        }
      }
      const rawNode = lib.getRawNode(raw)
      const instanceId = `${lib.getId()}@${raw.label}@${uniqueId()}`
      const props: Record<string, unknown> = parseProps(raw.props, this.#propsGenerator, this.#provider, true)
      const defaultEvent = registerEvents(instanceId, raw, this.#provider)

      const node: VNode = rawNode ? (isVNode(rawNode) ? rawNode : h(rawNode)) : h("i")
      const dst: BaseComponent = {
        id: instanceId,
        libraryId: lib.getId(),
        raw,
        props,
        events: defaultEvent,
        context: this.#provider,
        node: h(Shell, {
          instanceId,
          component: node,
          provider: this.#provider,
        }),
        children: [],
      }
      return dst
    } else {
      console.warn("[generate] cannot find library for raw component", raw)
    }
  }
  /**
   * 刷新current组件所有属性
   */
  refresh(newProps: Record<string, Props>, current: BaseComponent) {
    console.log("[refresh]", newProps, current)
    current.raw.props = newProps
    current.props = parseProps(current.raw.props, this.#propsGenerator, this.#provider)
  }
  /**
   * 刷新单个current组件属性
   */
  refreshProp(propName: string, newProp: Props, current: BaseComponent) {
    console.log("[refreshProp]", propName, newProp, current)
    const newPropValue = parseProp(propName, newProp, this.#propsGenerator, this.#provider)
    if (Object.hasOwn(current.raw.props, propName)) {
      current.raw.props[propName].metaValue = newProp.metaValue
      current.props[propName] = newPropValue
    }
  }
  getPropsGenerator(): PropsGenerator {
    return this.#propsGenerator
  }
}
