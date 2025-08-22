import * as THREE from "three"
import { OrbitControls } from "three/addons"
import Stats from "three/addons/libs/stats.module.js"
import { El } from "./el"
import { useKeyboard } from "./useKeyboard"
import { Loader } from "./loader"
import { ThreeEv, World } from "./types"
import { db } from "./db"
import { EventBus, useEvent } from "@toolmain/shared"

// TODO: 添加ScalePanel等比缩放 或者 window.resize事件
export class Core {
  scene: THREE.Scene // 场景
  camera: THREE.PerspectiveCamera // 相机
  renderer: THREE.WebGLRenderer // 渲染器
  db = db
  stats: Stats = new Stats() //fps 统计
  clock: THREE.Clock = new THREE.Clock() // 时间控制器
  // prevTime: DOMHighResTimeStamp = performance.now()
  raycaster: THREE.Raycaster = new THREE.Raycaster() // 射线投射器
  // pointerCtrls: PointerLockControls // 鼠标控制器
  orbitCtrls: OrbitControls
  keyboard = useKeyboard()
  container: El = new El()
  loader: Loader
  world: World
  #uv: EventBus<any> = useEvent()
  constructor() {
    this.keyboard.init()
    this.loader = new Loader(this)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera()
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    // this.pointerCtrls = this.initPointerCtrls(this.camera)
    this.orbitCtrls = this.#initOrbitCtrls()
    this.world = {
      core: this,
      bot: null,
      scene: null,
      lights: null,
    }
    const { width, height } = this.container.size()
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  /**
   * 资源初始化
   */
  init(el: HTMLElement) {
    this.container.setEl(el)
    this.scene = this.#initScene()
    this.camera = this.#initCamera()
    this.renderer = this.#initRenderer()
    el.appendChild(this.renderer.domElement)
    // el.appendChild(this.stats.dom)
    this.on("Resize", this.#onRefresh.bind(this))
    window.addEventListener("resize", this.#onWindowResize.bind(this))
    this.#startLoop()
  }
  once<K extends keyof ThreeEv>(event: K, callback: ThreeEv[K]): Core {
    this.#uv.once(event, callback)
    return this
  }
  on<K extends keyof ThreeEv>(event: K, callback: ThreeEv[K]): Core {
    this.#uv.on(event, callback)
    return this
  }
  emit<K extends keyof ThreeEv>(event: K, ...args: Parameters<ThreeEv[K]>): Core {
    this.#uv.emit(event, ...args)
    return this
  }
  render(): void {
    const delta = Math.min(this.clock.getDelta(), 0.1)
    // this.stats.update()
    this.orbitCtrls.update()
    this.renderer.render(this.scene, this.camera)
    this.emit("Render", delta)
  }
  dispose(): void {
    this.emit("Dispose")
    this.renderer.setAnimationLoop(null)
    window.removeEventListener("resize", this.#onWindowResize.bind(this))
    this.keyboard.ev.removeAllListeners()
    this.keyboard.dispose()
    this.camera.clear()
    this.orbitCtrls.dispose()
    this.loader.dispose()
    this.scene.clear()
    this.renderer.dispose()
    this.#uv.removeAllListeners()
  }
  #startLoop(): void {
    this.renderer.setAnimationLoop(this.render.bind(this))
  }
  #onRefresh() {
    const { width, height } = this.container.size()
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  #onWindowResize() {
    this.emit("Resize")
  }
  #initScene(): THREE.Scene {
    const scene = this.scene ? this.scene : new THREE.Scene()
    return scene
  }
  #initCamera(): THREE.PerspectiveCamera {
    const { width, height } = this.container.size()
    const camera = this.camera ? this.camera : new THREE.PerspectiveCamera(50, width / height, 0.1, 2000)
    this.on("CameraUpdate", e => {
      camera.fov = e.fov ?? camera.fov
      camera.aspect = e.aspect ?? camera.aspect
      camera.near = e.near ?? camera.near
      camera.far = e.far ?? camera.far
      camera.updateProjectionMatrix()
    })
    return camera
  }

  #initRenderer(): THREE.WebGLRenderer {
    const { width, height } = this.container.size()
    const renderer = this.renderer
      ? this.renderer
      : new THREE.WebGLRenderer({
          antialias: true,
        })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xffffff)
    this.renderer.domElement.addEventListener("click", event => {
      const { width, height } = this.container.size()
      const mouse = new THREE.Vector2()
      mouse.x = (event.clientX / width) * 2 - 1
      mouse.y = -(event.clientY / height) * 2 + 1
      //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标
      //通过鼠标点的位置和当前相机的矩阵计算出raycaster
      this.raycaster.setFromCamera(mouse, this.camera)
      // 获取raycaster直线和所有模型相交的数组集合
      const intersects = this.raycaster.intersectObjects(this.scene.children)
      this.emit("RendererClick", mouse.clone(), intersects)
    })
    return renderer
  }

  #initOrbitCtrls(): OrbitControls {
    const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    orbitControls.enablePan = true
    orbitControls.enableDamping = false
    orbitControls.addEventListener("change", e => {
      this.emit("OrbitChanged", e)
    })
    orbitControls.update()
    return orbitControls
  }
  // #initPointerCtrls(camera: THREE.Camera): PointerLockControls {
  //   const pointerLockControls = new PointerLockControls(camera, this.renderer.domElement)
  //   pointerLockControls.addEventListener("lock", e => {
  //     this.emit("PointerLock", e)
  //   })
  //   pointerLockControls.addEventListener("unlock", e => {
  //     this.emit("PointerUnlock", e)
  //   })
  //   this.scene.add(pointerLockControls.getObject())
  //   return pointerLockControls
  // }
}
