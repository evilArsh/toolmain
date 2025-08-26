<template>
  <div ref="threeRef" class="threeWrap">
    <Debugger v-if="debug" :world="world" :lights></Debugger>
    <Load :world="world"></Load>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { Core, LightMeta, Scene, TargetData, World } from "./three"
import Debugger from "./debugger/index.vue"
import Load from "./load/index.vue"
import { Lights, LightsEvent } from "./three/lights"
import * as THREE from "three"
import useDebugger from "./debugger/useDebugger"
import { ElDescriptions } from "element-plus"
import { ElDescriptionsItem } from "element-plus"
import { ElInput } from "element-plus"
import { isUndefined } from "@toolmain/shared"
import { watch, computed, markRaw, h, onMounted, onBeforeUnmount, useTemplateRef } from "vue"
export type ControlConf = {
  target: { x: number; y: number; z: number }
}
export type CameraConf = {
  position: { x: number; y: number; z: number }
}
export type RendererConf = {
  clearColor: string
}
export type ThreePanelConf = {
  url?: string
  control: ControlConf
  camera: CameraConf
  renderer: RendererConf
  lights: Array<LightMeta>
}
const { addPanel } = useDebugger()
const emit = defineEmits<{
  targetClick: [TargetData]
  loaded: [World]
}>()
const props = defineProps<{
  /**
   * if true, will add a panel for debugging. press `m` to toggle the panel
   */
  debug?: boolean
  /**
   * if you want to use draco decoder, must specify `dracoDecoderPath`
   *
   * 1. you can set the path with cdn url: `https://www.gstatic.com/draco/versioned/decoders/1.5.7/`
   * 2. or copy the draco decoder files to your `/public/droc/gltf` directory, and set the value to `/droc/gltf`
   */
  dracoDecoderPath?: string
  /**
   * config for rendering models
   */
  config: ThreePanelConf
}>()
const config = computed(() => props.config)
const url = computed(() => config.value.url)
const camera = computed(() => config.value.camera)
const control = computed(() => config.value.control)
const renderer = computed(() => config.value.renderer)
const lights = computed(() => config.value.lights)
// temp start
const color = markRaw(new THREE.Color())
// temp end

const threeRef = useTemplateRef<HTMLElement>("threeRef")
const core = markRaw(new Core())
const world: World = {
  core: core,
  bot: null,
  scene: markRaw(
    new Scene(core, {
      dracoLoaderPath: props.dracoDecoderPath,
    })
  ),
  lights: markRaw(new Lights(core)),
}
function init() {
  try {
    if (!threeRef.value) return
    core.init(threeRef.value)
    core.world = world
    world.core.on("TargetClick", data => {
      emit("targetClick", data)
    })
    world.lights?.ev.on(
      LightsEvent.ObjectChange,
      (data: { id: string; position: THREE.Vector3; rotate: THREE.Euler }) => {
        const meta = lights.value?.find(l => l.id === data.id)
        if (meta) {
          meta.position = data.position
          meta.rotate = data.rotate
        }
      }
    )
    world.lights?.ev.on(LightsEvent.ObjectAdd, (meta: LightMeta) => {
      if (!lights.value?.find(l => l.id === meta.id)) {
        lights.value?.push(meta)
      }
    })
    world.lights?.ev.on(LightsEvent.ObjectRemove, (id: string) => {
      const index = lights.value?.findIndex(l => l.id === id)
      if (!isUndefined(index) && index !== -1) {
        lights.value?.splice(index, 1)
      }
    })
    world.core.on("Render", () => {
      Object.assign(camera.value.position, world.core.camera.position)
      Object.assign(control.value.target, world.core.orbitCtrls.target)
      renderer.value.clearColor = `#${world.core.renderer.getClearColor(color).getHex().toString(16).padStart(6, "0")}`
    })
    refreshUrl(props.config.url)
    refreshCamera(camera.value)
    refreshControl(control.value)
    refreshRenderer(renderer.value)
    refreshLights(lights.value)
    emit("loaded", world)
    addPanel({
      id: "Config",
      label: "Config",
      node: h(ElDescriptions, { border: true, column: 1 }, () =>
        h(ElDescriptionsItem, { label: "config" }, () =>
          h(ElInput, {
            readonly: true,
            type: "textarea",
            rows: 6,
            autosize: true,
            value: JSON.stringify(props.config, null, 2),
          })
        )
      ),
    })
    setTimeout(() => {
      world.core.emit("Resize")
    })
  } catch (error) {
    world.core.emit("Log", { code: 500, msg: `[init error]${(error as Error).message}` })
  }
}

function refreshUrl(url?: string) {
  if (!url) return
  console.log("[url]", url)
  world.scene?.dispose()
  world.scene?.load(url)
}
function refreshCamera(data?: CameraConf) {
  if (!data) return
  core.camera.position.copy(data.position)
}
function refreshControl(data?: ControlConf) {
  if (!data) return
  core.orbitCtrls.target.copy(data.target)
  core.orbitCtrls.update()
}
function refreshRenderer(data?: RendererConf) {
  if (!data) return
  world.core.renderer.setClearColor(new THREE.Color(data.clearColor))
}
function refreshLights(lights?: LightMeta[]) {
  if (!lights) return
  console.log("[lights]", lights)
  lights.forEach(meta => {
    world.lights?.add(meta)
  })
}
watch(url, refreshUrl)
watch(camera, refreshCamera)
watch(control, refreshControl)
watch(renderer, refreshRenderer)
watch(lights, refreshLights)
onMounted(init)
onBeforeUnmount(() => {
  world.scene?.dispose()
  world.lights?.dispose()
  world.core.dispose()
})
defineExpose({
  world,
})
</script>
<style lang="scss" scoped>
.threeWrap {
  position: relative;
  flex: 1;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
}
</style>
