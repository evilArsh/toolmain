import * as THREE from "three"
import { GLTFLoader, DRACOLoader, type GLTF, FBXLoader, OBJLoader } from "three/addons"
import { LoadParam, LoadOptions, ThreeEv } from "./types"
import { EventBus, useEvent } from "@toolmain/shared"
export type LoaderEvent = Pick<ThreeEv, "LoadError" | "LoadProgress" | "LoadStart" | "Loaded" | "Log" | "Custom">
export type LoaderConfig = {
  dracoLoaderPath?: string
}
export class Loader {
  private manager: THREE.LoadingManager
  data: Record<string, LoadParam> = {}
  #loaders: THREE.Loader[] = []
  #dracoLoader: DRACOLoader
  private uv: EventBus<any> = useEvent()
  constructor(config?: LoaderConfig) {
    this.#dracoLoader = new DRACOLoader()
    this.#dracoLoader.setDecoderPath(config?.dracoLoaderPath ?? "/draco/gltf/")
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
  on<K extends keyof LoaderEvent>(event: K, callback: LoaderEvent[K]): Loader {
    this.uv.on(event, callback)
    return this
  }
  emit<K extends keyof LoaderEvent>(event: K, ...args: Parameters<LoaderEvent[K]>): Loader {
    this.uv.emit(event, ...args)
    return this
  }
  onProgress(url: string, loaded: number, total: number) {
    this.data[url] = { ...(this.data[url] ?? {}), ...{ url, loaded, total } }
    this.emit("LoadProgress", this.data[url])
  }
  onStart(url: string, loaded: number, total: number) {
    this.data[url] = { ...(this.data[url] ?? {}), ...{ url, loaded, total } }
    this.emit("LoadStart", this.data[url])
  }
  onLoaded() {
    this.emit("Loaded")
  }
  onError(url: string) {
    this.emit("LoadError", url)
  }
  async load<T>(path: string, conf?: LoadOptions): Promise<T | null> {
    try {
      this.data[path] = { url: path, loaded: 0, total: 0, ...conf }
      const loader = this.manager.getHandler(path)
      if (!loader) {
        this.emit("Log", { code: 500, msg: `unsupported source type：${path}` })
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
    gltf.setDRACOLoader(this.#dracoLoader)
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
