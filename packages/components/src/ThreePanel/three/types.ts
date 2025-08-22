import * as THREE from "three"
import { Scene } from "./scene"
import { Bot } from "./bot"
import { Core } from "./core"
import { OrbitControls, PointerLockControls, TransformControlsMode } from "three/addons"
import { Lights } from "./lights"

// --- loader
export interface LoadProgressData {
  url: string
  /**
   * 资源已加载数
   */
  loaded: number
  /**
   * 资源总数
   */
  total: number
  describe?: string
}

export type TargetData =
  | { type: "TargetSrc"; data: TargetSrc }
  | { type: "RemoteSrc"; data: RemoteSrc }
  | { type: "Object"; data: THREE.Object3D<THREE.Object3DEventMap> }
export interface LoadOptions {
  /**
   * 独立弹框提示，而不是被新的消息覆盖
   */
  independent?: boolean
}
export type LoadParam = LoadProgressData & LoadOptions
// --- loader

// --- core
export interface World {
  core: Core
  bot: Bot | null
  scene: Scene | null
  lights: Lights | null
}

export interface ThreeEv {
  /**
   * OrbitControl 控制器 change 事件触发
   */
  OrbitChanged: (e: THREE.Event<"change", OrbitControls>) => void
  /**
   * PointerLockControls lock事件
   */
  PointerLock: (e: THREE.Event<"lock", PointerLockControls>) => void
  /**
   * PointerLockControls unlock事件
   */
  PointerUnlock: (e: THREE.Event<"unlock", PointerLockControls>) => void
  /**
   * 调用一次render前触发
   */
  Render: (delta: number) => void
  RendererClick: (
    mouse: THREE.Vector2,
    intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  ) => void
  /**
   * 窗口尺寸发生变化触发
   */
  Resize: () => void
  /**
   * 场景和渲染器资源即将被释放
   */
  Dispose: () => void
  /**
   * 全局资源加载进度
   */
  LoadStart: (e: LoadParam) => void
  /**
   * 全局资源加载进度
   */
  LoadProgress: (e: LoadParam) => void
  /**
   * 全局资源加载进度
   */
  Loaded: () => void
  /**
   * 全局资源加载进度
   */
  LoadError: (url: string) => void
  /**
   * 日志
   */
  Log: (msg: { code: number; msg: string; data?: { type?: string; data?: unknown } }) => void
  /**
   * 相机参数改变
   */
  CameraUpdate: (e: {
    position: {
      x: number
      y: number
      z: number
    }
    fov?: number
    aspect?: number
    near?: number
    far?: number
  }) => void
  /**
   * 用作EventBus的自定义事件
   */
  Custom: (e: { type: string; data?: unknown }) => void
  /**
   * 点击目标触发,该目标配置了点击一个面的行为:跳转到指定位置或弹出一个url弹窗
   */
  TargetClick: (e: TargetData) => void
  /**
   * 场景加载完毕
   */
  SceneLoaded: () => void
}
// --- core

// --- scene
/**
 * 远程资源,贴图,视频等
 */
export interface RemoteSrc {
  /**
   * 资源类型
   *  1:图片 2:视频 3:链接 4:颜色 5:接口
   */
  sourceType: number
  /**
   * 插槽ID（名字）
   */
  slotId: string
  /**
   * 自定义插槽名
   */
  slotName?: string
  /**
   * 要设置的颜色
   */
  color?: string
  /**
   * 图片/视频地址
   */
  fileUrl?: string
  /**
   * 除了图片/视频外的其它资源
   */
  content?: string
}
export interface TargetSrc {
  id: number
  /**
   * 跳转位置名称
   */
  targetPosition: string
  /**
   * 1=>内部菜单跳转
   *
   * 2=>外部菜单跳转
   */
  jumpType: number
  /**
   * url链接或者场景内其它面的name
   */
  targetId: string
  slotId: string
}
// --- scene

// --- light
export enum LightType {
  PointLight = "PointLight",
  DirectionalLight = "DirectionalLight",
  SpotLight = "SpotLight",
  AmbientLight = "AmbientLight",
  HemisphereLight = "HemisphereLight",
}

export interface LightMeta {
  /**
   * 必须指定唯一id
   */
  id: string
  type: LightType | string
  color: string | THREE.Color
  groundColor?: string | THREE.Color

  /**
   * helper 会被创建，该字段控制其可视性
   */
  helper?: boolean
  helperColor?: string
  helperSize?: number
  visible?: boolean

  position?: { x: number; y: number; z: number }
  rotate?: { x: number; y: number; z: number }
  name?: string
  /**
   * 强度
   */
  intensity?: number
  distance?: number
  angle?: number
  castShadow?: boolean
  penumbra?: number
  decay?: number
  /**
   * 是否需要TransformControls
   */
  debugger?: boolean
  /**
   * 调试器模式
   */
  mode?: TransformControlsMode
  [x: string]: any
}
// --- light
