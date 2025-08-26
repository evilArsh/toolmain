import * as THREE from "three"
import { Core } from "./core"
import { LightMeta, LightType } from "./types"
import { TransformControls } from "three/addons"
import { EventBus, isUndefined, toNumber, useEvent } from "@toolmain/shared"

export enum LightsEvent {
  ObjectChange = "objectChange",
  ObjectAdd = "objectAdd",
  ObjectRemove = "objectRemove",
}
function refreshProps(obj: object, data: LightMeta, omit: string[]) {
  Object.entries(data).forEach(([key, value]) => {
    if (Reflect.has(obj, key) && !isUndefined(value) && !omit.includes(key)) {
      Reflect.set(obj, key, value)
    }
  })
}

function newPointLight(data: LightMeta) {
  const light = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay)
  const helper = new THREE.PointLightHelper(
    light,
    toNumber(data.helperSize) ?? 1,
    new THREE.Color(data.helperColor ?? "#ffffff")
  )
  helper.visible = !!data.helper
  light.visible = !!data.visible
  if (data.position) {
    light.position.copy(data.position)
  }
  if (data.rotate) {
    light.rotation.set(data.rotate.x, data.rotate.y, data.rotate.z, "XYZ")
  }
  refreshProps(light, data, ["position"])
  return { light, helper }
}
function newDirectionalLight(data: LightMeta) {
  const light = new THREE.DirectionalLight(data.color, data.intensity)
  const helper = new THREE.DirectionalLightHelper(
    light,
    toNumber(data.helperSize) ?? 1,
    new THREE.Color(data.helperColor ?? "#ffffff")
  )
  helper.visible = !!data.helper
  light.visible = !!data.visible
  if (data.position) {
    light.position.copy(data.position)
  }
  if (data.rotate) {
    light.rotation.set(data.rotate.x, data.rotate.y, data.rotate.z, "XYZ")
  }
  refreshProps(light, data, ["position"])
  return { light, helper }
}
function newSpotLight(data: LightMeta) {
  const light = new THREE.SpotLight(data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay)
  const helper = new THREE.SpotLightHelper(light, new THREE.Color(data.helperColor ?? "#ffffff"))
  light.visible = !!data.visible
  helper.visible = !!data.helper
  if (data.position) {
    light.position.copy(data.position)
  }
  if (data.rotate) {
    light.rotation.set(data.rotate.x, data.rotate.y, data.rotate.z, "XYZ")
  }
  refreshProps(light, data, ["position"])
  return { light, helper }
}
function newAmbientLight(data: LightMeta) {
  const light = new THREE.AmbientLight(data.color, data.intensity)
  light.visible = !!data.visible
  if (data.position) {
    light.position.copy(data.position)
  }
  if (data.rotate) {
    // light.lookAt(new THREE.Vector3(data.rotate.x, data.rotate.y, data.rotate.z))
    light.rotation.set(data.rotate.x, data.rotate.y, data.rotate.z, "XYZ")
  }
  refreshProps(light, data, ["position"])
  return { light }
}
function newHemisphereLight(data: LightMeta) {
  const light = new THREE.HemisphereLight(data.color, data.groundColor, data.intensity)
  const helper = new THREE.HemisphereLightHelper(
    light,
    toNumber(data.helperSize) ?? 1,
    new THREE.Color(data.helperColor ?? "#ffffff")
  )
  light.visible = !!data.visible
  helper.visible = !!data.helper
  refreshProps(light, data, ["position"])
  return { light, helper }
}

function newLightTransformerCtrl(core: Core, _meta: LightMeta, _light: THREE.Light) {
  const control = new TransformControls(core.camera, core.renderer.domElement)
  control.setMode("translate")
  return control
}

export class Lights {
  ev: EventBus<any> = useEvent()
  #core: Core
  #data: Map<
    string,
    {
      meta: LightMeta
      light: THREE.Light<any>
      helper?: THREE.Object3D
      transformerCtrl?: TransformControls
    }
  >
  constructor(core: Core) {
    this.#core = core
    this.#data = new Map()
    this.#core.on("Render", _delta => {
      this.#data.forEach(v => {
        if (v.helper && v.helper.visible) {
          ;(v.helper as any)?.update()
        }
      })
    })
  }
  #preHandleData(meta: LightMeta) {
    const _meta = { ...meta }
    if (_meta.color) {
      _meta.color = new THREE.Color(_meta.color)
    }
    if (_meta.groundColor) {
      _meta.groundColor = new THREE.Color(_meta.groundColor)
    }
    return _meta
  }
  update(meta: LightMeta) {
    const cloneMeta = this.#preHandleData(meta)
    const data = this.#data.get(cloneMeta.id)
    if (!data) return
    if (cloneMeta.position) {
      data.light.position.copy(cloneMeta.position)
    }
    if (cloneMeta.rotate) {
      // data.light.lookAt(new THREE.Vector3(meta.rotate.x, meta.rotate.y, meta.rotate.z))
      data.light.rotation.set(cloneMeta.rotate.x, cloneMeta.rotate.y, cloneMeta.rotate.z, "XYZ")
    }
    refreshProps(data.light, cloneMeta, ["position"])
    if (data.helper) {
      data.helper.visible = !!cloneMeta.helper
    }
    if (data.transformerCtrl) {
      data.transformerCtrl.setMode(cloneMeta.mode ?? "translate")
      if (!cloneMeta.debugger) {
        data.transformerCtrl.detach()
      } else {
        data.transformerCtrl.attach(data.light)
      }
    }
  }
  add(meta: LightMeta) {
    const cloneMeta = this.#preHandleData(meta)
    if (this.#data.has(cloneMeta.id)) {
      this.update(cloneMeta)
    } else {
      let light: THREE.Light | undefined = undefined
      let helper: THREE.Object3D | undefined = undefined
      let transformerCtrl: TransformControls | undefined = undefined
      if (cloneMeta.type === LightType.PointLight) {
        ;({ light, helper } = newPointLight(cloneMeta))
      } else if (cloneMeta.type === LightType.DirectionalLight) {
        ;({ light, helper } = newDirectionalLight(cloneMeta))
      } else if (cloneMeta.type === LightType.SpotLight) {
        ;({ light, helper } = newSpotLight(cloneMeta))
      } else if (cloneMeta.type === LightType.AmbientLight) {
        ;({ light } = newAmbientLight(cloneMeta))
      } else if (cloneMeta.type === LightType.HemisphereLight) {
        ;({ light, helper } = newHemisphereLight(cloneMeta))
      } else {
        return
      }
      transformerCtrl = newLightTransformerCtrl(this.#core, cloneMeta, light)
      transformerCtrl.addEventListener("dragging-changed", event => {
        this.#core.orbitCtrls.enabled = !event.value
      })
      transformerCtrl.addEventListener("objectChange", event => {
        this.ev.emit(LightsEvent.ObjectChange, {
          id: cloneMeta.id,
          position: event.target.object.position.clone(),
          rotate: event.target.object.rotation.clone(),
        })
      })
      if (cloneMeta.debugger) {
        transformerCtrl.attach(light)
      }
      this.#data.set(cloneMeta.id, { meta: cloneMeta, light, helper, transformerCtrl })
      this.#core.scene.add(...[light, helper, transformerCtrl?.getHelper()].filter(v => !!v))
      this.ev.emit(LightsEvent.ObjectAdd, cloneMeta)
    }
  }
  clear(id: string) {
    const data = this.#data.get(id)
    if (!data) return
    this.#core.scene.remove(data.light)
    data.helper && this.#core.scene.remove(data.helper)
    if (data.transformerCtrl) {
      this.#core.scene.remove(data.transformerCtrl.getHelper())
      data.transformerCtrl.dispose()
      data.transformerCtrl = undefined
    }
    data.light.dispose()
    this.#data.delete(id)
    this.ev.emit(LightsEvent.ObjectRemove, id)
  }
  dispose() {
    for (const id of this.#data.keys()) {
      this.clear(id)
    }
    this.#data.clear()
    this.ev.removeAllListeners()
  }
}
