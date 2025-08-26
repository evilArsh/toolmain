import * as THREE from "three"
import { type GLTF } from "three/addons"
import { Core } from "./core"
// import { MeshBVH, MeshBVHHelper, StaticGeometryGenerator, type MeshBVHOptions } from "three-mesh-bvh"
import { LoadOptions, RemoteSrc, TargetSrc } from "./types"
import { Loader, LoaderConfig } from "./loader"
import { getModel } from "./db"
import { resolvePath } from "@toolmain/shared"

export class Scene {
  model?: GLTF
  remoteResources: Record<string, RemoteSrc> = {}
  bvh?: THREE.Mesh
  // bvhHelper?: MeshBVHHelper
  remoteTarget: Record<string, TargetSrc> = {}
  /**
   * when true,emit the `RendererClick` event
   */
  clickNotify: boolean = false
  private blobUrls: string[] = []
  readonly loader: Loader
  private core: Core
  constructor(core: Core, loaderConfig?: LoaderConfig) {
    this.core = core
    this.loader = new Loader(loaderConfig)
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
   * set texture
   */
  setRemoteTexture(src: RemoteSrc) {
    if (!this.model) {
      this.core.emit("Log", { code: 500, msg: `[setRemoteTexture：model not loaded yet]:${src.fileUrl}` })
      return
    }
    this.remoteResources[src.objectName] = { ...src }
    const target = this.core.scene.getObjectByName(src.objectName)
    if (!target) {
      this.core.emit("Log", { code: 500, msg: `[setRemoteTexture：slot is undefined]：${JSON.stringify(src)}` })
    }
    if (target && (target as THREE.Mesh).isMesh) {
      const tar = target as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>
      if (src.sourceType == 1) {
        this.core.emit("Log", { code: 200, msg: `[set images texture]${JSON.stringify(src)}` })
        // image
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
              this.core.emit("Log", { code: 500, msg: `[images load failed]${(e as Error).message}` })
            })
        } else {
          this.core.emit("Log", { code: 500, msg: `[images url not exist]${JSON.stringify(src)}` })
        }
      } else if (src.sourceType == 2) {
        // video
        this.core.emit("Log", { code: 200, msg: `[set videos texture]${JSON.stringify(src)}` })
        if (src.fileUrl) {
          const video = this.createVideo(resolvePath(src.fileUrl))
          const texture = new THREE.VideoTexture(video)
          texture.flipY = false
          tar.material.map = texture
          tar.material.needsUpdate = true
        } else {
          this.core.emit("Log", { code: 500, msg: `[load video failed,url not exist]${JSON.stringify(src)}` })
        }
      } else if (src.sourceType == 3) {
        this.core.emit("Log", { code: 500, msg: `[unsupported resources type]${JSON.stringify(src)}` })
      } else if (src.sourceType == 4) {
        tar.material.color.set(new THREE.Color(src.color))
      } else if (src.sourceType == 5) {
        this.core.emit("Log", { code: 500, msg: `[unsupported api resource]${JSON.stringify(src)}` })
      }
    }
  }
  /**
   * set a anchor of an object, when click the object,the corresponding event will be triggered
   */
  setRemoteTarget(src: TargetSrc[] | TargetSrc) {
    this.core.emit("Log", { code: 200, msg: `[setRemoteTarget] ${JSON.stringify(src)}` })
    if (Array.isArray(src)) {
      this.remoteTarget = {}
      src.forEach(val => {
        this.remoteTarget[val.objectName] = { ...val }
      })
    } else {
      this.remoteTarget[src.objectName] = { ...src }
    }
  }
  async load(gltfPath: string, conf?: LoadOptions) {
    let url = gltfPath
    this.core.emit("Log", { code: 100, msg: `[load scene]${url}` })
    const res = await getModel(url, e => {
      this.loader.emit("LoadProgress", {
        loaded: e.loaded,
        total: e.total,
        url: url,
        independent: true,
      })
    })
    this.core.emit("Log", { code: res.code, msg: `[model load complete] ${res.msg}` })
    if (res.data) {
      this.core.emit("Log", { code: 100, msg: `[load local cached data]${url}` })
      url = URL.createObjectURL(res.data)
      this.blobUrls.push(url)
    } else {
      this.core.emit("Log", { code: 500, msg: `[error loading scene]${JSON.stringify(res)}` })
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
    // construct bvh
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
   * emit click event for debug
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
