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
   * loaded resources' number
   */
  loaded: number
  /**
   * total resources' number
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
   * mark the loading progress bar is independent
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
   * OrbitControl trigger `change` event
   */
  OrbitChanged: (e: THREE.Event<"change", OrbitControls>) => void
  /**
   * PointerLockControls trigger `lock` event
   */
  PointerLock: (e: THREE.Event<"lock", PointerLockControls>) => void
  /**
   * PointerLockControls trigger `unlock` event
   */
  PointerUnlock: (e: THREE.Event<"unlock", PointerLockControls>) => void
  /**
   * triggered before each render loop
   */
  Render: (delta: number) => void
  RendererClick: (
    mouse: THREE.Vector2,
    intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  ) => void
  /**
   * triggered when window resize
   */
  Resize: () => void
  /**
   * scene and renderer resources will be disposed
   */
  Dispose: () => void
  /**
   * global resource loading progress
   */
  LoadStart: (e: LoadParam) => void
  /**
   * global resource loading progress
   */
  LoadProgress: (e: LoadParam) => void
  /**
   * global resource loading progress
   */
  Loaded: () => void
  /**
   * global resource loading progress
   */
  LoadError: (url: string) => void
  /**
   * log event
   */
  Log: (msg: { code: number; msg: string; data?: { type?: string; data?: unknown } }) => void
  /**
   * camera params update
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
   * custom event for eventbus
   */
  Custom: (e: { type: string; data?: unknown }) => void
  /**
   * when click the specified object
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
   * resource type
   *
   *  1:image 2:video 3:link 4:color 5:api
   */
  sourceType: number
  objectName: string
  /**
   * color will be used as texture
   */
  color?: string
  /**
   * image/video address
   */
  fileUrl?: string
  /**
   * other resource except image/video
   */
  content?: string
}
export interface TargetSrc {
  objectName: string
  data: Record<string, any>
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
   * unique id is required
   */
  id: string
  type: LightType | string
  color: string | THREE.Color
  groundColor?: string | THREE.Color
  /**
   * light helper will be created, this field control it's visibility
   */
  helper?: boolean
  helperColor?: string
  helperSize?: number
  visible?: boolean
  position?: { x: number; y: number; z: number }
  rotate?: { x: number; y: number; z: number }
  name?: string
  intensity?: number
  distance?: number
  angle?: number
  castShadow?: boolean
  penumbra?: number
  decay?: number
  /**
   * if need TransformControls
   */
  debugger?: boolean
  /**
   * debugger mode
   */
  mode?: TransformControlsMode
  [x: string]: any
}
// --- light
