import { placeholderRaw } from "./components/placeholder"
import {
  BaseComponent,
  BaseComponentSerialized,
  ComponentProvider,
  RawComponent,
  ComponentLabel,
  BaseConfigProps,
} from "./types"

export default class NodeTree {
  #treeMap: Map<string, BaseComponent> = new Map()
  #root: BaseComponent[]
  constructor() {
    this.#root = []
  }
  #hasSlotname(raw: RawComponent, slotname: string): boolean {
    return !!raw.slots && Object.prototype.hasOwnProperty.call(raw.slots, slotname)
  }
  /**
   * 递归删除当前节点下的所有子节点的map映射
   */
  #removeMap(data: BaseComponent): void {
    if (this.#treeMap.has(data.id)) {
      this.#treeMap.delete(data.id)
      data.children.forEach(v => {
        this.#removeMap(v)
      })
    }
  }
  #setMap(root: BaseComponent[]) {
    root.forEach(v => {
      this.#treeMap.set(v.id, v)
      this.#setMap(v.children)
    })
  }
  // 在parent下插槽名为slotname的节点中children下索引为index的位置插入target
  #insertSibling(
    target: BaseComponent,
    provider: ComponentProvider,
    index: number,
    parent: BaseComponent,
    slotname: string
  ): BaseComponent | undefined {
    target.slotname = slotname
    const oldChild = parent.children.find(v => v.slotname === slotname)
    if (!oldChild) {
      const newSlotChild = this.createSlot(parent, slotname, provider)
      if (newSlotChild) {
        target.parent = newSlotChild
        newSlotChild.children.push(target)
        this.#treeMap.set(target.id, target)
        return target
      }
    } else {
      const hasPlaceHolder = oldChild.children.some(v => {
        const lib = provider.getLibrary(v.libraryId)
        return lib?.isPlaceHolder(v.raw)
      })
      if (hasPlaceHolder) {
        // 当插槽中存在占位符时，先清空插槽
        this.clearSlot(parent, slotname, provider)
      }
      target.parent = oldChild
      target.slotname = slotname
      oldChild.children.splice(index, 0, target)
      this.#treeMap.set(target.id, target)
      return target
    }
  }
  // 替换parent下插槽名为slotname的节点中children下索引为index的节点为target
  #replace(target: BaseComponent, index: number, parent: BaseComponent, slotname: string): BaseComponent | undefined {
    const slotChild = parent.children.find(v => v.slotname === slotname)
    if (!slotChild) {
      console.warn("[replace] cannot find slotChild", slotname, parent)
      return
    }
    if (index < 0 || index >= slotChild.children.length) {
      console.warn(`[replace] index outof bound:${index}`, parent.children)
      return
    }
    target.parent = slotChild
    target.slotname = slotname
    const res = slotChild.children.splice(index, 1, target)
    res.forEach(v => this.#removeMap(v))
    this.#treeMap.set(target.id, target)
    return target
  }
  /**
   * @description 根据实例id搜索节点
   */
  findByInstanceId(instanceId: string): BaseComponent | undefined {
    return this.#treeMap.get(instanceId)
  }
  findParent(instanceId: string, provider: ComponentProvider): BaseComponent | undefined {
    const current = this.findByInstanceId(instanceId)
    const parent = current?.parent
    if (current && parent) {
      const parentLib = provider.getLibrary(parent.libraryId)
      if (!parentLib) {
        console.warn("[findParent] cannot find library", parent.libraryId)
        return
      }
      if (parentLib.isDefault(parent.raw)) {
        return this.findParent(parent.id, provider)
      }
      return parent
    } else {
      console.warn("[findParent] cannot find parent or current", parent, current)
    }
  }
  findChild(instanceId: string, provider: ComponentProvider): BaseComponent | undefined {
    const current = this.findByInstanceId(instanceId)
    if (current) {
      const currLib = provider.getLibrary(current.libraryId)
      if (!currLib) {
        console.warn("[findChild] cannot find library", current.libraryId)
        return
      }
      if (currLib.isDefault(current.raw)) {
        return current.children.length > 0 ? current.children[0] : undefined
      } else {
        if (current.children.length == 0) return
        const child = current.children.find(v => v.slotname == "default")
        if (child) {
          return this.findChild(child.id, provider)
        } else {
          return this.findChild(current.children[0].id, provider)
        }
      }
    }
  }
  findSibling(instanceId: string, prev: boolean, provider: ComponentProvider): BaseComponent | undefined {
    const current = this.findByInstanceId(instanceId)
    const parent = current?.parent
    if (current) {
      const currLib = provider.getLibrary(current.libraryId)
      if (!currLib) {
        console.warn("[findParent] cannot find library", current.libraryId)
        return
      }
      if (currLib.isDefault(current.raw)) {
        return
      }
      const children = parent ? parent.children : this.#root
      const index = children.findIndex(v => v.id === current.id)
      if (prev) {
        return index - 1 >= 0 ? children[index - 1] : children[children.length - 1]
      } else {
        return index + 1 >= children.length ? children[0] : children[index + 1]
      }
    } else {
      console.warn("[findSibling] cannot find parent or current", parent, current)
    }
  }
  /**
   * @description 删除`childId`子节点，如果`parentId`不存在，则删除根节点
   * 如果已经删除了节点，则只删除对应的map映射
   */
  removeChild(childId: string): BaseComponent | undefined {
    const child = this.#treeMap.get(childId)
    if (child) {
      const parent = child.parent
      const target = parent ? parent.children : this.#root
      const index = target.findIndex(v => v.id === childId)
      if (index > -1) {
        target.splice(index, 1)
      }
      this.#removeMap(child)
      return child
    } else {
      console.warn(`[removeChild] cannot find child`, `id:${childId}`)
    }
  }
  appendNode(
    target: BaseComponent,
    provider: ComponentProvider,
    index: number,
    append: boolean,
    parentId?: string,
    slotname?: string
  ): BaseComponent | undefined {
    slotname = slotname ?? "default"
    const lib = provider.getLibrary(target.libraryId)
    if (!lib) {
      console.warn("[appendNode] cannot find library", target.raw)
      return
    }
    let parent: BaseComponent | undefined = parentId ? this.findByInstanceId(parentId) : undefined
    if (parent) {
      const parentLib = provider.getLibrary(parent.libraryId)
      if (!parentLib) {
        console.warn("[appendNode] cannot find library for parent", parent)
        return
      }
      if (parentLib.isDefault(parent.raw)) {
        parent = parent.parent
        if (!parent) {
          console.error("[appendNode] default component cannot be a root node", parent)
          return
        }
      }
      // parent拥有该插槽名时才能插入
      if (!this.#hasSlotname(parent.raw, slotname)) {
        console.error(
          `[appendNode] component doesn't have this slotname`,
          `id:${parent.raw.label} slotname:${slotname}`
        )
        return
      }
      if (!append) {
        return this.#replace(target, index, parent, slotname)
      } else {
        return this.#insertSibling(target, provider, index, parent, slotname)
      }
    } else {
      // 插入/替换 根节点
      target.parent = undefined
      target.slotname = undefined
      const willDel = this.#root.splice(index, append ? 0 : 1, target)
      willDel.forEach(v => this.#removeMap(v))
      this.#treeMap.set(target.id, target)
      return target
    }
  }
  pushRaw(
    source: RawComponent,
    provider: ComponentProvider,
    index: number,
    append: boolean,
    parentId?: string,
    slotname?: string
  ): BaseComponent | undefined {
    const lib = provider.getLibraryByRaw(source)
    if (!lib) {
      console.warn(`[pushRootRaw] cannot find component library`, source)
      return
    }
    const component = provider.getComponentGenerator().generate(source)
    if (!component) {
      console.warn(`[pushRootRaw] generate component failed`, source)
      return
    }
    const current = this.appendNode(component, provider, index, append, parentId, slotname)
    // 组件插入成功
    if (current && source.slots) {
      // 组件存在插槽
      for (const [childSlot, childRaw] of Object.entries(source.slots)) {
        if (childRaw.label !== ComponentLabel.NULL) {
          this.pushRaw(childRaw, provider, 0, true, current.id, childSlot)
        }
      }
      return current
    } else {
      !current && console.warn(`[pushRootRaw] push component failed`, source)
    }
  }

  moveTo(
    srcId: string,
    provider: ComponentProvider,
    index: number,
    append: boolean,
    parentId?: string,
    slotname?: string
  ): BaseComponent | undefined {
    const srcNode = this.findByInstanceId(srcId)
    if (!srcNode) {
      console.warn(`[moveTo] cannot find srcNode when move`, `id:${srcId}`)
      return
    }
    const srcParent = srcNode.parent?.children ?? this.#root
    // 在原插槽/根节点中的位置
    const srcIndex = srcParent.findIndex(v => v.id === srcNode.id)
    if (srcIndex < 0) {
      console.error("[moveTo] cannot find srcNode in parent", srcId)
      return
    }
    const dstParent = parentId ? this.findByInstanceId(parentId) : undefined
    if (srcNode.parent !== dstParent) {
      const res = this.appendNode(srcNode, provider, index, append, parentId, slotname)
      if (res) {
        srcParent.splice(srcIndex, 1)
        // 原插槽为空时，插入占位符
        if (srcParent.length == 0) {
          const placeholder = provider.getComponentGenerator().generate(placeholderRaw())
          if (placeholder) {
            srcParent.push(placeholder)
          }
        }
        return srcNode
      } else {
        console.warn(`[moveTo] appendNode failed`, srcNode)
      }
    } else {
      // 同一级下的元素移动
      const dst = dstParent?.children ?? this.#root
      if (!append) {
        const target = dst[index]
        dst.splice(srcIndex, 1)
        const targetIndex = dst.findIndex(v => v.id === target.id)
        const res = dst.splice(targetIndex, 1, srcNode)
        res.forEach(v => this.#removeMap(v))
        return srcNode
      } else {
        dst.splice(srcIndex, 1)
        dst.splice(srcIndex < index ? index - 1 : index, 0, srcNode)
      }
    }
  }
  /**
   * @description 清空`target`的`slotname`插槽
   */
  clearSlot(target: BaseComponent, slotname: string, provider: ComponentProvider): BaseComponent | undefined {
    const lib = provider.getLibraryByComponent(target)
    if (!lib) {
      console.warn(`[clearSlot] cannot find component library`, target)
      return
    }
    if (lib.isDefault(target.raw)) {
      console.warn("[clearSlot] the target is default component, cannot clear slot", target)
      return
    }
    const slotChild = target.children.find(v => v.slotname === slotname)
    if (slotChild) {
      slotChild.children.forEach(v => this.#removeMap(v))
      slotChild.children = []
      return slotChild
    } else {
      return this.createSlot(target, slotname, provider)
    }
  }
  /**
   * @description 创建`target`的`slotname`插槽
   */
  createSlot(target: BaseComponent, slotname: string, provider: ComponentProvider): BaseComponent | undefined {
    const lib = provider.getLibraryByComponent(target)
    if (!lib) {
      console.warn(`[createSlot] cannot find component library`, target)
      return
    }
    if (lib.isDefault(target.raw)) {
      console.warn("[createSlot] the target is default component, cannot create slot", target)
      return
    }
    const slotChild = target.children.find(v => v.slotname === slotname)
    if (slotChild) {
      console.warn("[createSlot] the slot is already exist", slotname, target)
      return slotChild
    } else {
      if (!this.#hasSlotname(target.raw, slotname)) {
        console.warn("[createSlot] the target doesn't have this slotname", slotname, target)
        return
      }
      const newSlot = provider.getComponentGenerator().generate(lib.getDefault())
      if (newSlot) {
        newSlot.parent = target
        newSlot.slotname = slotname
        target.children.push(newSlot)
        this.#treeMap.set(newSlot.id, newSlot)
        return newSlot
      } else {
        console.warn("[createSlot] create slot failed", slotname, target)
      }
    }
  }
  /**
   * 设置根节点
   */
  setNodes(root: BaseComponent[]) {
    this.clearNodes()
    this.#root = Array.from(root)
    this.#setMap(this.#root)
  }
  /**
   * @description 获取节点树中的所有节点
   */
  getNodes(): BaseComponent[] {
    return this.#root
  }
  getNodesLength(): number {
    return this.#treeMap.size
  }
  clearNodes(): void {
    this.#treeMap.clear()
    this.#root.length = 0
  }
  /**
   * @description 静态节点树恢复成组件树
   */
  deserialize(provider: ComponentProvider, root: BaseComponentSerialized[], parent?: BaseComponent): BaseComponent[] {
    return root
      .map<BaseComponent | undefined>(val => {
        const lib = provider.getLibrary(val.libraryId)
        const raw = lib?.getRaw(val.label)
        if (lib && raw) {
          val.props.forEach(meta => {
            // 以组件元数据中的数据为参考，如果组件元数据中没有该属性，则不会生成该属性
            if (Object.hasOwn(raw.props, meta.propName)) {
              Object.assign(raw.props[meta.propName], meta, { propName: undefined })
            }
          })
          const component = provider.getComponentGenerator().generate(raw)
          if (component) {
            // provider.getComponentGenerator().refresh(raw.props, component)
            component.parent = parent
            component.slotname = val.slotname
            component.children = this.deserialize(provider, val.children, component)
            return component
          }
        } else {
          console.warn("[deserialize] lib or raw data not found", val.libraryId, val.label)
        }
      })
      .filter<BaseComponent>(v => !!v)
  }
  /**
   * @description 获取节点树静态数据
   */
  serialize(parent: BaseComponent[]): BaseComponentSerialized[] {
    return parent.map<BaseComponentSerialized>(val => {
      return {
        label: val.raw.label,
        props: Object.entries(val.raw.props).map<BaseConfigProps>(
          ([propName, val]) =>
            ({
              propName,
              finalType: val.finalType,
              metaValue: val.metaValue,
              valueType: val.valueType,
              variableId: val.variableId,
              hidden: val.hidden,
              disabled: val.disabled,
            }) as BaseConfigProps
        ),
        libraryId: val.libraryId,
        slotname: val.slotname,
        children: this.serialize(val.children),
      } as BaseComponentSerialized
    })
  }
}
