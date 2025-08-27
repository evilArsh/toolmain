import { useEvent, EventBus, EventBusCallback } from "@toolmain/shared"
import {
  ComponentProvider,
  RawComponent,
  ComponentLibrary,
  BaseComponent,
  DeliverParam,
  ComponentVarState,
} from "./types"
import NodeTree from "./nodeTree"
import { ComponentGenerator } from "./components/generator"
import { VarState } from "./vars/store"

export class Provider implements ComponentProvider {
  #tmpComponent?: DeliverParam
  #libraries: Map<string, ComponentLibrary>
  #nodeTree: NodeTree
  #componentGenerator: ComponentGenerator
  #varState: ComponentVarState
  #ev: EventBus<{ [x: string]: any }>
  #emitStack: string[] // 跟踪当前调用链（检测循环）
  #isEmitting: boolean // 检测是否处于 emit 中（检测嵌套）
  constructor() {
    this.#emitStack = []
    this.#isEmitting = false
    this.#ev = useEvent()
    this.#nodeTree = new NodeTree()
    this.#libraries = new Map()
    this.#varState = new VarState()
    this.#componentGenerator = new ComponentGenerator(this)
  }
  getNodeTree(): NodeTree {
    return this.#nodeTree
  }

  getCurrent(): DeliverParam | undefined {
    const tmp = this.#tmpComponent
    this.#tmpComponent = undefined
    return tmp
  }
  setCurrent(component: DeliverParam): void {
    this.#tmpComponent = component
  }
  addLibrary(library: ComponentLibrary): void {
    this.#libraries.set(library.getId(), library)
  }
  getLibrary(libraryId: string): ComponentLibrary | undefined {
    return this.#libraries.get(libraryId)
  }
  getLibraryByRaw(raw: RawComponent): ComponentLibrary | undefined {
    return this.#libraries.values().find(v => v.hasComponent(raw))
  }
  getLibraryByComponent(component: BaseComponent): ComponentLibrary | undefined {
    return this.getLibrary(component.libraryId)
  }
  getLibraries(): ComponentLibrary[] {
    return Array.from(this.#libraries.values())
  }
  getComponentGenerator(): ComponentGenerator {
    return this.#componentGenerator
  }
  getVarState(): ComponentVarState {
    return this.#varState
  }
  // implements EventBus start
  setMaxListeners(n: number): void {
    this.#ev.setMaxListeners(n)
  }
  addListener(type: string, listener: EventBusCallback): void {
    this.#ev.addListener(type, listener)
  }
  removeAllListeners(type?: string): void {
    this.#ev.removeAllListeners(type)
  }
  removeListener(type: string, listener: EventBusCallback): void {
    this.#ev.removeListener(type, listener)
  }
  prependListener(type: string, listener: EventBusCallback): void {
    this.#ev.prependListener(type, listener)
  }
  emit(type: string, ...args: any[]): void {
    // console.log(`[${type}]`, ...args)
    // 检测是否在另一个 emit 的回调中触发
    if (this.#isEmitting) {
      console.warn(
        `[provider emit] Nested emit detected: emitting "${type}" during another emit,[${[...this.#emitStack, type].join("->")}]`
      )
    }
    if (this.#emitStack.includes(type)) {
      console.error(`[provider emit] Circular emit detected: [${[...this.#emitStack, type].join("->")}]`)
    }
    this.#isEmitting = true
    this.#emitStack.push(type)
    this.#ev.emit(type, ...args)
    this.#emitStack.pop()
    this.#isEmitting = false
  }
  on(type: string, listener: EventBusCallback): void {
    this.#ev.on(type, listener)
  }
  off(type: string, listener: EventBusCallback): void {
    this.#ev.off(type, listener)
  }
  once(type: string, listener: EventBusCallback): void {
    this.#ev.once(type, listener)
  }
  // implements EventBus end
}
