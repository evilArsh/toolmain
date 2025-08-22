import * as THREE from "three"
import { type GLTF } from "three/addons"
import { Core } from "./core"
import { KeyCode } from "./useKeyboard"
import { LoadOptions } from "./types"
import { LoaderPure } from "./loaderPure"
import { useCollider } from "./useCollider"
import { getModel } from "./db"
import { EventBus, useEvent } from "@toolmain/shared"

export enum BotActionName {
  IDLE = "idle",
  RUN = "run",
  WALK = "walk",
  JUMP = "jump",
}
export type BotActionMap = {
  [key in BotActionName]: string
}
export interface BotAction {
  // weight: number
  name: string
  action: THREE.AnimationAction
}
export interface BotOptions {
  core: Core
  initPosition?: THREE.Vector3
  jumpHeight?: number
  speed?: number
  actionMap?: BotActionMap
}
export interface BotEv {
  BotPos: (e: THREE.Vector3) => void
  BotLoaded: (model: THREE.Group<THREE.Object3DEventMap>) => void
}

export class Bot {
  box = new THREE.Box3()
  size = new THREE.Vector3()
  // bvh?: THREE.Mesh
  // bvhHelper?: MeshBVHHelper
  animateDuration = 0.35
  model?: GLTF

  animations: THREE.AnimationClip[] = []
  mixer: THREE.AnimationMixer | undefined = undefined
  skeleton: THREE.SkeletonHelper | undefined = undefined
  /**
   * 预设的动作列表，包括权重、名称以及实际的Action对象
   */
  baseActions: BotAction[] = []

  direction: THREE.Vector3 = new THREE.Vector3()
  move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 0, // 移动速度
    jumpHeight: 0, // 跳跃高度
    canJump: true,
    jumping: false,
    status: "idle",
    onFloor: true,
  }
  initPosition: THREE.Vector3

  readonly loader = new LoaderPure()
  readonly core: Core
  readonly collider?: ReturnType<typeof useCollider>

  private currentAction?: BotAction

  // private cameraRaycaster: THREE.Raycaster = new THREE.Raycaster()
  private uv: EventBus<any> = useEvent()

  private actionMap: BotActionMap
  constructor(opts: BotOptions) {
    if (!opts.actionMap) {
      const map: Record<string, string> = {}
      Object.values(BotActionName).forEach(v => {
        map[v] = v
      })
      this.actionMap = map as BotActionMap
    } else {
      this.actionMap = opts.actionMap
    }
    this.core = opts.core
    this.initPosition = opts.initPosition ?? new THREE.Vector3(0, 5, 10)
    this.move.speed = opts.speed ?? 4.0
    this.move.jumpHeight = opts.jumpHeight ?? 3
    this.init()
    this.collider = useCollider(this)
  }
  /**
   * 加载人物bot
   */
  async load(gltfPath: string, conf?: LoadOptions): Promise<GLTF | null> {
    let url = gltfPath
    const resDb = await getModel(url, e => {
      this.loader.emit("LoadProgress", {
        loaded: e.loaded,
        total: e.total,
        url: `${url}?worker`,
        independent: true,
      })
    })
    this.core.emit("Log", resDb)
    console.log("[加载 indexedDB bot]", resDb)
    if (resDb.data) {
      url = URL.createObjectURL(resDb.data)
      this.core.emit("Log", { code: 100, msg: `[bot加载本地缓存]${url}` })
    } else {
      this.core.emit("Log", { code: 500, msg: `[加载bot:indexedDB出错]${JSON.stringify(resDb)}` })
    }
    const model = await this.loader.loadGLTF(url, conf)
    console.log("[加载人物模型]", model)
    this.core.emit("Log", { code: 100, msg: `加载人物模型:${url}` })
    if (!model) return null
    this.emit("BotLoaded", model.scene)
    model.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    this.animations = model.animations
    this.mixer = new THREE.AnimationMixer(model.scene)
    this.skeleton = new THREE.SkeletonHelper(model.scene)
    this.box.expandByObject(model.scene)
    this.box.getSize(this.size)
    for (let i = 0; i < this.animations.length; i++) {
      const clip = this.animations[i]
      const action = this.mixer.clipAction(clip)
      const targetAction = this.baseActions.find(v => v.name === clip.name)
      if (!targetAction) {
        const newAction = {
          name: clip.name,
          action: action,
        }
        this.baseActions.push(newAction)
        // 初始设置状态为idle
        if (clip.name == this.actionMap.idle) {
          newAction.action.play()
          this.currentAction = newAction
          this.currentAction.action.fadeIn(0)
        }
      }
    }
    this.model = model
    this.core.scene.add(model.scene)
    this.collider?.init()
    this.collider?.reset()
    return model
  }
  /**
   * 瞬移人物到指定向量位置
   */
  teleport(x: number, y: number, z: number) {
    this.collider?.teleport(x, y, z)
  }
  update(delta: number) {
    this.collider?.update(delta)
    this.mixer?.update(delta)
  }

  once<K extends keyof BotEv>(event: K, callback: BotEv[K]): Bot {
    this.uv.once(event, callback)
    return this
  }
  on<K extends keyof BotEv>(event: K, callback: BotEv[K]): Bot {
    this.uv.on(event, callback)
    return this
  }
  emit<K extends keyof BotEv>(event: K, ...args: Parameters<BotEv[K]>): Bot {
    this.uv.emit(event, ...args)
    return this
  }
  run() {
    this.move.status = BotActionName.RUN
    this._action(this.baseActions.find(v => v.name === this.actionMap.run))
  }
  walk() {
    this.move.status = BotActionName.WALK
    this._action(this.baseActions.find(v => v.name === this.actionMap.walk))
  }
  idle() {
    this.move.status = BotActionName.IDLE
    this._action(this.baseActions.find(v => v.name === this.actionMap.idle))
  }
  dispose() {
    // TODO: 释放资源
    this.core.emit("Log", { code: 100, msg: `Bot 释放资源` })
  }

  // 计算和判断人物移动方向
  private init() {
    this.core.keyboard.ev.on(KeyCode.KeyW, (s: boolean) => {
      this.move.forward = s
    })
    this.core.keyboard.ev.on(KeyCode.KeyS, (s: boolean) => {
      this.move.backward = s
    })
    this.core.keyboard.ev.on(KeyCode.KeyA, (s: boolean) => {
      this.move.left = s
    })
    this.core.keyboard.ev.on(KeyCode.KeyD, (s: boolean) => {
      this.move.right = s
    })
    this.core.keyboard.ev.on(KeyCode.Space, (s: boolean) => {
      if (s && this.move.onFloor) {
        this.collider?.jump()
        this.move.onFloor = false
      }
    })
    this.core.keyboard.ev.on(KeyCode.keydown, (e: string[]) => {
      const cond =
        e.includes(KeyCode.KeyW) || e.includes(KeyCode.KeyA) || e.includes(KeyCode.KeyS) || e.includes(KeyCode.KeyD)
      if (cond) {
        if (e.includes(KeyCode.ShiftLeft)) this.run()
        else this.walk()
      }
    })
    this.core.keyboard.ev.on(KeyCode.keyup, (e: string[]) => {
      const cond = !(
        e.includes(KeyCode.KeyW) ||
        e.includes(KeyCode.KeyA) ||
        e.includes(KeyCode.KeyS) ||
        e.includes(KeyCode.KeyD)
      )
      if (cond) {
        this.idle()
      } else {
        if (e.includes(KeyCode.ShiftLeft)) this.run()
        else this.walk()
      }
    })
  }
  private setWeight(action: BotAction, weight: number): BotAction {
    if (action.action) {
      action.action.enabled = true
      action.action.setEffectiveTimeScale(1)
      action.action.setEffectiveWeight(weight)
    }
    return action
  }

  private _action(nextAction?: BotAction) {
    if (!nextAction) return
    if (this.currentAction?.name === nextAction.name) {
      return
    }
    this.currentAction?.action.fadeOut(this.animateDuration)
    nextAction.action.reset()
    this.setWeight(nextAction, 1)
    nextAction.action.fadeIn(this.animateDuration).play()
    this.currentAction = nextAction
  }
}
