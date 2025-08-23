import * as THREE from "three"
import { GLTFLoader, DRACOLoader, type GLTF, FBXLoader, OBJLoader } from "three/addons"
import { LoadParam, LoadOptions, ThreeEv } from "./types"
import { EventBus, resolvePath, useEvent } from "@toolmain/shared"
export type LoaderEvent = Pick<ThreeEv, "LoadError" | "LoadProgress" | "LoadStart" | "Loaded" | "Log" | "Custom">
export class LoaderPure {
  private manager: THREE.LoadingManager
  data: Record<string, LoadParam> = {}
  #loaders: THREE.Loader[] = []
  private uv: EventBus<any> = useEvent()
  constructor() {
    this.manager = new THREE.LoadingManager()
    this.init()
  }

  private init() {
    this.manager.onStart = this.onStart.bind(this)
    this.manager.onProgress = this.onProgress.bind(this)
    this.manager.onLoad = this.onLoaded.bind(this)
    this.manager.onError = this.onError.bind(this)

    this.manager.addHandler(/.*\.(mp4)$/, new THREE.Loader(this.manager))
    this.manager.addHandler(/(.*\.(glb|gltf)|(^blob:.*))$/, this.#getGLTFLoader(this.manager))
    this.manager.addHandler(/.*\.fbx$/, new FBXLoader(this.manager))
    this.manager.addHandler(/.*\.obj$/, new OBJLoader(this.manager))
    this.manager.addHandler(/.*\.(png|jpg|jpeg|bmp)$/, new THREE.TextureLoader(this.manager))
  }
  on<K extends keyof LoaderEvent>(event: K, callback: LoaderEvent[K]): LoaderPure {
    this.uv.on(event, callback)
    return this
  }
  emit<K extends keyof LoaderEvent>(event: K, ...args: Parameters<LoaderEvent[K]>): LoaderPure {
    this.uv.emit(event, ...args)
    return this
  }
  /**
   * 资源加载进度设置
   * @param url 资源路径
   * @param loaded 已加载量
   * @param total 总量
   */
  onProgress(url: string, loaded: number, total: number) {
    this.data[url] = { ...(this.data[url] ?? {}), ...{ url, loaded, total } }
    this.emit("LoadProgress", this.data[url])
  }
  /**
   * 资源开始加载进度设置
   * @param url 资源路径
   * @param loaded 已加载量
   * @param total 总量
   */
  onStart(url: string, loaded: number, total: number) {
    this.data[url] = { ...(this.data[url] ?? {}), ...{ url, loaded, total } }
    this.emit("LoadStart", this.data[url])
  }
  /**
   * 所有资源加载完毕
   */
  onLoaded() {
    this.emit("Loaded")
  }
  /**
   * 资源加载错误
   * @param url 资源路径
   */
  onError(url: string) {
    this.emit("LoadError", url)
  }
  async load<T>(path: string, conf?: LoadOptions): Promise<T | null> {
    try {
      this.data[path] = { url: path, loaded: 0, total: 0, ...conf }
      const loader = this.manager.getHandler(path)
      // console.log("[load模型]", `url:${path}`, `loader:`, loader)
      if (!loader) {
        this.emit("Log", { code: 500, msg: `不支持加载的资源类型：${path}` })
        return null
      }
      this.#loaders.push(loader)
      return (loader as THREE.Loader<T>).loadAsync(path)
    } catch (error) {
      console.log("[load error]", error, path)
      this.emit("Log", { code: 500, msg: `[load error:${path}]${(error as Error).message}` })
      throw error
    }
  }

  async loadGLTF(path: string, conf?: LoadOptions): Promise<GLTF | null> {
    return this.load<GLTF>(path, conf)
  }

  async loadFBX(path: string, conf?: LoadOptions): Promise<THREE.Group<THREE.Object3DEventMap> | null> {
    return this.load<THREE.Group<THREE.Object3DEventMap>>(path, conf)
  }

  #getGLTFLoader(manager: THREE.LoadingManager): GLTFLoader {
    const gltf = new GLTFLoader(manager)
    const dracoLoader = new DRACOLoader()
    const p = new URL("./draco", import.meta.url)
    dracoLoader.setDecoderPath(resolvePath(p.href, false, true))
    gltf.setDRACOLoader(dracoLoader)
    return gltf
  }
  dispose() {
    this.#loaders.forEach(loader => {
      loader.abort()
      if (Reflect.has(loader, "dispose")) {
        ;(loader as any).dispose()
      }
    })
    this.#loaders = []
    this.manager.abort()
  }
}
