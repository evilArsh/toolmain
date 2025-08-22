import * as THREE from "three"
import { type GLTF } from "three/addons"
import { Core } from "./core"
// import { MeshBVH, MeshBVHHelper, StaticGeometryGenerator, type MeshBVHOptions } from "three-mesh-bvh"
import { LoadOptions, RemoteSrc, TargetSrc } from "./types"
import { LoaderPure } from "./loaderPure"
import { getModel } from "./db"
import { resolvePath } from "@toolmain/shared"

export class Scene {
  model?: GLTF
  remoteResources: Record<string, RemoteSrc> = {}
  bvh?: THREE.Mesh
  // bvhHelper?: MeshBVHHelper
  remoteTarget: Record<string, TargetSrc> = {}
  /**
   * RendererClick 事件发生时，是否emit，用于调试
   */
  clickNotify: boolean = false
  private blobUrls: string[] = []
  readonly loader = new LoaderPure()
  private core: Core
  constructor(core: Core) {
    this.core = core
    this.init()
  }
  private createVideo(url: string) {
    const video = document.createElement("video")
    video.src = url
    video.controls = true
    video.volume = 0
    video.loop = true
    video.autoplay = true
    video.muted = true
    video.crossOrigin = "anonymous"
    // video.play()
    return video
  }
  /**
   * 设置一个面的纹理
   */
  setRemoteTexture(src: RemoteSrc) {
    if (!this.model) {
      this.core.emit("Log", { code: 500, msg: `[设置资源：模型还未加载]:${src.fileUrl}` })
      return
    }
    this.remoteResources[src.slotId] = { ...src }
    const target = this.core.scene.getObjectByName(src.slotId)
    if (!target) {
      this.core.emit("Log", { code: 500, msg: `[设置资源：插槽不存在]：${JSON.stringify(src)}` })
    }
    if (target && (target as THREE.Mesh).isMesh) {
      const tar = target as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>
      /**
       * TODO: 优化逻辑
       * 1:图片 2:视频 3:链接 4:接口
       */
      if (src.sourceType == 1) {
        this.core.emit("Log", { code: 200, msg: `[设置图片资源]${JSON.stringify(src)}` })
        // 图片
        if (src.fileUrl) {
          this.core.loader
            .load<THREE.Texture>(resolvePath(src.fileUrl), {})
            .then(texture => {
              if (texture) {
                texture.flipY = false
                tar.material.map = texture
                tar.material.needsUpdate = true
              }
            })
            .catch(e => {
              this.core.emit("Log", { code: 500, msg: `[资源加载失败]${(e as Error).message}` })
            })
        } else {
          this.core.emit("Log", { code: 500, msg: `[资源加载失败,url不存在]${JSON.stringify(src)}` })
        }
      } else if (src.sourceType == 2) {
        // video
        this.core.emit("Log", { code: 200, msg: `[设置视频资源]${JSON.stringify(src)}` })
        if (src.fileUrl) {
          const video = this.createVideo(resolvePath(src.fileUrl))
          const texture = new THREE.VideoTexture(video)
          texture.flipY = false
          tar.material.map = texture
          tar.material.needsUpdate = true
        } else {
          this.core.emit("Log", { code: 500, msg: `[资源加载失败,url不存在]${JSON.stringify(src)}` })
        }
      } else if (src.sourceType == 3) {
        this.core.emit("Log", { code: 500, msg: `[暂不支持链接资源]${JSON.stringify(src)}` })
        // 网站链接
        // const domObj = this.createWebSite(gtUrl(src.content), child.position)
        // this.core.scene.add(domObj)
      } else if (src.sourceType == 4) {
        tar.material.color.set(new THREE.Color(src.color))
      } else if (src.sourceType == 5) {
        this.core.emit("Log", { code: 500, msg: `[暂不支持接口资源]${JSON.stringify(src)}` })
      }
    }
  }
  /**
   * 设置一个面的锚点数据,当点击时判断跳转或者弹出网页
   */
  setRemoteTarget(src: TargetSrc[] | TargetSrc) {
    this.core.emit("Log", { code: 200, msg: `[setRemoteTarget] ${JSON.stringify(src)}` })
    if (Array.isArray(src)) {
      this.remoteTarget = {}
      src.forEach(val => {
        this.remoteTarget[val.slotId] = { ...val }
      })
    } else {
      this.remoteTarget[src.slotId] = { ...src }
    }
  }
  async load(gltfPath: string, conf?: LoadOptions) {
    let url = gltfPath
    this.core.emit("Log", { code: 100, msg: `[加载场景]${url}` })
    const res = await getModel(url, e => {
      this.loader.emit("LoadProgress", {
        loaded: e.loaded,
        total: e.total,
        url: url,
        independent: true,
      })
    })
    this.core.emit("Log", { code: res.code, msg: `[模型加载完成] ${res.msg}` })
    console.log("[加载 indexedDB scene]", res)
    if (res.data) {
      this.core.emit("Log", { code: 100, msg: `[scene加载本地缓存]${url}` })
      url = URL.createObjectURL(res.data)
      this.blobUrls.push(url)
    } else {
      this.core.emit("Log", { code: 500, msg: `[加载场景:indexedDB出错]${JSON.stringify(res)}` })
    }
    const model = await this.loader.loadGLTF(url, conf)
    if (!model) {
      return
    }
    model.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    // 构建 bvh
    // const staticGenerator = new StaticGeometryGenerator(model.scene)
    // staticGenerator.attributes = ["position"]
    // const generateGeometry = staticGenerator.generate() as THREE.BufferGeometry<THREE.NormalBufferAttributes> & {
    //   boundsTree: MeshBVH
    // }
    // generateGeometry.boundsTree = new MeshBVH(generateGeometry, { lazyGeneration: false } as MeshBVHOptions)
    // this.bvh = new THREE.Mesh(generateGeometry)
    // ;(this.bvh.material as THREE.MeshBasicMaterial).wireframe = true
    // ;(this.bvh.material as THREE.MeshBasicMaterial).opacity = 0.5
    // ;(this.bvh.material as THREE.MeshBasicMaterial).transparent = true
    // this.bvhHelper = new MeshBVHHelper(this.bvh, 20)
    // this.core.scene.add(this.bvhHelper)
    // this.core.scene.add(this.bvh)
    // this.bvh.visible = false
    // this.bvhHelper.visible = false
    this.disposeModel()
    this.model = model
    this.core.scene.add(this.model.scene)
    this.core.emit("SceneLoaded")
    this.loader.emit("Loaded")
    return model
  }
  setClickNotify(val?: boolean) {
    this.clickNotify = !!val
  }
  dispose() {
    this.loader.dispose()
    this.disposeModel()
  }
  private disposeModel() {
    this.clearBlob()
    const disposeChild = (mesh: THREE.Object3D) => {
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry?.dispose()
        // 处理材质
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          materials.forEach(mat => {
            if ("map" in mat && mat.map) mat.map.dispose()
            if ("envMap" in mat && mat.envMap) mat.envMap.dispose()
            Object.keys(mat).forEach(key => {
              const value = mat[key]
              if (value?.isTexture) value.dispose()
            })
            mat?.dispose()
          })
        }
      }
    }
    if (this.model) {
      this.model.scene.traverse(item => {
        disposeChild(item)
      })
      if (this.model.scene instanceof THREE.Group) {
        this.model.scene.clear()
      }
      this.core.scene.remove(this.model.scene)
      this.model = undefined
    }
  }
  private clearBlob() {
    this.blobUrls.forEach(r => {
      THREE.Cache.remove(r)
      URL.revokeObjectURL(r)
    })
    this.blobUrls = []
  }
  private init() {
    this.initSceneInteraction()
  }
  /**
   * 发出点击事件,用于debug
   */
  private onEmitClick(intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]) {
    if (this.clickNotify) {
      const obj = intersects[0]
      const format = JSON.stringify(
        {
          name: obj.object.name,
          distance: obj.distance,
          faceIndex: obj.faceIndex,
          face: obj.face?.normal,
          normal: obj.face?.normal.toArray(),
          object: {
            position: obj.object.position.toArray(),
            type: obj.object.type,
            userData: obj.object.userData,
            rotation: obj.object.rotation.toArray(),
            scale: obj.object.scale.toArray(),
            id: obj.object.id,
            uuid: obj.object.uuid,
          },
          point: obj.point.toArray(),
          uv: obj.uv?.normalize().toArray(),
        },
        null,
        "\t"
      )
      this.core.emit("Log", {
        code: 100,
        msg: `[RendererClick]\n${format}`,
        data: {
          type: "RendererClick",
          data: format,
        },
      })
    }
  }
  private onTargetClick(intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]) {
    const obj = intersects[0]
    if (this.remoteTarget[obj.object.name]) {
      const target = this.remoteTarget[obj.object.name]
      this.core.emit("TargetClick", {
        type: "TargetSrc",
        data: target,
      })
    } else if (this.remoteResources[obj.object.name]) {
      this.core.emit("TargetClick", {
        type: "RemoteSrc",
        data: this.remoteResources[obj.object.name],
      })
    } else {
      this.core.emit("TargetClick", {
        type: "Object",
        data: obj.object,
      })
    }
  }
  private initSceneInteraction() {
    // raycaster
    this.core.on(
      "RendererClick",
      async (_mouse: THREE.Vector2, intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]) => {
        if (intersects.length > 0) {
          // console.log("[RendererClick]", intersects)
          // const i = intersects.filter(v => !["Box3Helper", "GridHelper"].includes(v.object.type))
          const i = intersects.filter(v => v.object.visible)
          this.onEmitClick(i)
          this.onTargetClick(i)
        }
      }
    )
  }
}
