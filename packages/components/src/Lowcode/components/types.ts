import { type EventBus } from "@toolmain/shared"
import NodeTree from "../nodeTree"
import { BaseConfigProps, Props } from "../props/types"
import { CallBackFn } from "@toolmain/shared"
import type { Component, VNode } from "vue"
import { ComponentGenerator } from "./generator"
import { ComponentVarState } from "../types"

export enum ComponentLabel {
  /**
   * 空label占位符
   */
  NULL = "NULL",
  /**
   * 占位组件名称，只用于填充组件默认插槽的元素的名称
   */
  PLACEHOLDER = "PLACEHOLDER",
  /**
   * 占位文本，一般用于默认插槽中添加纯文本
   */
  PLAIN = "PLAIN",
}
/**
 * UI组件拥有的默认事件
 */
export type ComponentEvents = {
  name: string
  desc: string
  /**
   * 事件回调函数参数
   *
   * eg: ["value:string|number"]
   */
  args: string[]
  returnType?: string
  version?: string
}

/**
 * 组件元数据
 */
export type RawComponent = {
  /**
   * 组件名
   */
  label: string | ComponentLabel
  /**
   * 组件描述
   */
  desc: string
  /**
   * 属性元数据
   */
  props: Record<string, Props>
  slots?: Record<string, RawComponent>
  /**
   * UI组件默认事件
   */
  events?: Record<string, ComponentEvents>
  version?: string
}
/**
 * 组件实例数据，包含元数据
 */
export type BaseComponent = {
  /**
   * 组件实例id
   */
  id: string
  /**
   * 生成当前组件的组件库id
   */
  libraryId: string
  /**
   * 元数据
   */
  raw: RawComponent
  node: VNode
  /**
   * 组件属性
   */
  props: Record<string, unknown>
  /**
   * 组件自带事件
   */
  events: Record<string, CallBackFn>
  /**
   * 连接provider的hooks
   */
  // hooks: Record<string, CallBackFn>
  /**
   * 全局上下文
   */
  context: ComponentProvider
  /**
   * 当前节点的父节点
   */
  parent?: BaseComponent
  /**
   * 当前节点所在父节点的插槽名称
   */
  slotname?: string
  /**
   * `slotname`下的子组件
   */
  children: BaseComponent[]
}
/**
 * 只包含基础数据类型的BaseComponent
 */
export type BaseComponentSerialized = {
  // raw: RawComponent
  label: string
  props: Array<BaseConfigProps & { propName: string }>
  libraryId: string
  slotname?: string
  children: BaseComponentSerialized[]
}
export type DeliverParam = {
  instanceId?: string
  raw?: RawComponent
  /**
   * 事件触发时鼠标的X坐标
   */
  clientX?: number
  /**
   * 事件触发时鼠标的Y坐标
   */
  clientY?: number
}
/**
 * 全局provider事件分发和订阅器
 */
export interface ProviderEv {
  /**
   * 组件未被点击，只是hover
   */
  InstanceHover: (data?: DeliverParam) => void
  /**
   * 右键画布中的组件时触发
   */
  InstanceContextmenu: (data?: DeliverParam) => void
  /**
   * 组件点击事件,向Provider传递元信息
   */
  InstanceClick: (data: DeliverParam) => void
  /**
   * 当source组件实例开始拖动时
   */
  InstanceDragstart: (src: DeliverParam) => void
  InstanceDragend: (src: DeliverParam) => void
  /**
   * `实例组件/元组件`拖动到`实例组件/根组件`时触发
   *
   * 1. 元数据  拖向实例组件: src.raw && dst.instanceId
   * 2. 元数据  拖向根组件: src.raw
   * 3. 实例组件拖向实例组件: src.instanceId && dst.instanceId
   * 4. 实例组件拖向根组件: src.instanceId
   */
  InstanceDrop: (data: { src?: DeliverParam; dst?: DeliverParam }) => void
  InstanceDragenter: (data: DeliverParam) => void
  InstanceDragleave: (data: DeliverParam) => void
  InstanceDragover: (data: DeliverParam) => void
  /**
   * 组件内部自有事件被触发
   */
  DefaultEventsTrigger: (data: { eventName: string; instanceId: string; data: unknown }) => void
  /**
   * 组件库面板中双击元组件时触发
   */
  RawDbClick: (raw: DeliverParam) => void
  /**
   * 通知provider组件数据结构已更新
   */
  NeedUpdate: () => void
  /**
   * 通知provider单个组件属性已更新
   */
  NeedUpdateProps: (instanceId: string, key: string, prop: Props) => void
}
/**
 * 组件库接口
 */
export interface ComponentLibrary {
  /**
   * 组件库唯一ID
   */
  getId: () => string
  /**
   * 注册组件到当前组件库
   */
  registerComponent: (raw: RawComponent, node: VNode | Component) => void
  /**
   * 获取元组件列表
   */
  getRawConfig: () => RawComponent[]
  /**
   * 获取元组件
   */
  getRaw: (label: string) => RawComponent | undefined
  /**
   * 生成当前组件库设置的默认组件实例,该组件标识为一个容器，
   * 用于在插槽中放置多个子组件,不会被渲染
   */
  getDefault: () => RawComponent
  /**
   * 是否是组件库中的默认组件
   */
  isDefault(raw: RawComponent): boolean
  /**
   * 是否是组件库中的占位组件
   */
  isPlaceHolder(raw: RawComponent): boolean
  /**
   * 组件库是否拥有该组件
   */
  hasComponent(raw: RawComponent): boolean
  /**
   * 获取组件库的原始组件
   */
  getRawNode(raw: RawComponent): VNode | Component | undefined
}
/**
 * 全局组件provider调度器
 */
export interface ComponentProvider extends EventBus<ProviderEv> {
  /**
   * 获取最后一次拖到画布的组件元数据，获取一次后清除
   */
  getCurrent: () => DeliverParam | undefined
  /**
   * 向provider提供即将要生成的组件
   */
  setCurrent: (raw: DeliverParam) => void
  /**
   * 添加组件库
   */
  addLibrary: (library: ComponentLibrary) => void
  /**
   * 获取组件库
   */
  getLibrary: (libraryId: string) => ComponentLibrary | undefined
  /**
   * 通过`RawComponent`获取所属组件库
   */
  getLibraryByRaw: (raw: RawComponent) => ComponentLibrary | undefined
  /**
   * 通过`BaseComponent`获取所属组件库
   */
  getLibraryByComponent: (component: BaseComponent) => ComponentLibrary | undefined
  /**
   * 获取所有组件库
   */
  getLibraries: () => ComponentLibrary[]
  /**
   * 获取节点树数据结构
   */
  getNodeTree: () => NodeTree
  /**
   * 获取组件生成器
   */
  getComponentGenerator: () => ComponentGenerator
  /**
   * 获取变量状态管理器
   */
  getVarState: () => ComponentVarState
}
