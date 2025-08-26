<template>
  <div class="flex flex-col">
    <el-descriptions title="相机初始化参数" :column="2" border>
      <el-descriptions-item label="fov">
        <el-input-number v-model="form.camera.fov" @change="hdl.setInitParams" />
      </el-descriptions-item>
      <el-descriptions-item label="aspect">
        <el-input-number
          readonly
          v-model="form.camera.aspect"
          :precision="3"
          :step="0.01"
          @change="hdl.setInitParams" />
      </el-descriptions-item>
      <el-descriptions-item label="near">
        <el-input-number v-model="form.camera.near" :precision="3" :step="0.01" @change="hdl.setInitParams" />
      </el-descriptions-item>
      <el-descriptions-item label="far">
        <el-input-number v-model="form.camera.far" @change="hdl.setInitParams" />
      </el-descriptions-item>
      <el-descriptions-item label="相机位置" :span="2">
        <div class="flex gap3px">
          <el-input-number v-model="form.camera.position.x" :precision="2" :step="1" @change="hdl.onPositionChange" />
          <el-input-number v-model="form.camera.position.y" :precision="2" :step="1" @change="hdl.onPositionChange" />
          <el-input-number v-model="form.camera.position.z" :precision="2" :step="1" @change="hdl.onPositionChange" />
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="OrbitControls" :column="3" border>
      <el-descriptions-item label="enabled">
        <el-switch v-model="form.orbit.enabled" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="minDistance">
        <el-input-number
          v-model="form.orbit.minDistance"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="maxDistance">
        <el-input-number
          v-model="form.orbit.maxDistance"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="minZoom">
        <el-input-number
          v-model="form.orbit.minZoom"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="maxZoom">
        <el-input-number
          v-model="form.orbit.maxZoom"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="minTargetRadius">
        <el-input-number
          v-model="form.orbit.minTargetRadius"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="maxTargetRadius">
        <el-input-number
          v-model="form.orbit.maxTargetRadius"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="minPolarAngle">
        <el-input-number
          v-model="form.orbit.minPolarAngle"
          :min="0"
          :max="Math.PI"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="maxPolarAngle">
        <el-input-number
          v-model="form.orbit.maxPolarAngle"
          :min="0"
          :max="Math.PI"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="minAzimuthAngle">
        <el-input-number
          v-model="form.orbit.minAzimuthAngle"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="maxAzimuthAngle">
        <el-input-number
          v-model="form.orbit.maxAzimuthAngle"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="enableDamping">
        <el-switch v-model="form.orbit.enableDamping" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="dampingFactor">
        <el-input-number
          v-model="form.orbit.dampingFactor"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="enableZoom">
        <el-switch v-model="form.orbit.enableZoom" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="zoomSpeed">
        <el-input-number
          v-model="form.orbit.zoomSpeed"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="zoomToCursor">
        <el-switch v-model="form.orbit.zoomToCursor" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="enableRotate">
        <el-switch v-model="form.orbit.enableRotate" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="rotateSpeed">
        <el-input-number
          v-model="form.orbit.rotateSpeed"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="enablePan">
        <el-switch v-model="form.orbit.enablePan" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="panSpeed">
        <el-input-number
          v-model="form.orbit.panSpeed"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="screenSpacePanning">
        <el-switch v-model="form.orbit.screenSpacePanning" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="keyPanSpeed">
        <el-input-number
          v-model="form.orbit.keyPanSpeed"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
      <el-descriptions-item label="autoRotate">
        <el-switch v-model="form.orbit.autoRotate" @change="hdl.orbitUpdate"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="autoRotateSpeed">
        <el-input-number
          v-model="form.orbit.autoRotateSpeed"
          :controls="false"
          :precision="2"
          :step="0.01"
          @change="hdl.orbitUpdate" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import { ElDescriptions, ElDescriptionsItem, ElInputNumber, ElSwitch } from "element-plus"
import { computed, onMounted, reactive } from "vue"
import { World } from "../three"
import { useDebounceFn } from "@vueuse/core"
const props = defineProps<{
  world: World
}>()
const world = computed(() => props.world)
const form = reactive({
  camera: {
    fov: 0,
    aspect: 0,
    near: 0,
    far: 0,
    position: { x: 0, y: 0, z: 0 },
  },
  orbit: {
    enabled: true,
    minDistance: 0,
    maxDistance: Infinity,
    minZoom: 0,
    maxZoom: 0,
    minTargetRadius: 0,
    maxTargetRadius: Infinity,
    minPolarAngle: 0, // 0 to Math.PI radians
    maxPolarAngle: 0, // 0 to Math.PI radians
    minAzimuthAngle: Infinity,
    maxAzimuthAngle: Infinity,
    enableDamping: false,
    dampingFactor: 0.05,
    enableZoom: true,
    zoomSpeed: 1.0,
    zoomToCursor: false,
    enableRotate: true,
    rotateSpeed: 1.0,
    enablePan: true,
    panSpeed: 1,
    screenSpacePanning: true,
    keyPanSpeed: 7,
    autoRotate: true,
    autoRotateSpeed: 2,
  },
})
const hdl = {
  onPositionChange() {
    world.value.core.camera.position.set(form.camera.position.x, form.camera.position.y, form.camera.position.z)
  },
  setInitParams() {
    world.value.core.emit("CameraUpdate", {
      fov: form.camera.fov,
      aspect: form.camera.aspect,
      near: form.camera.near,
      far: form.camera.far,
      position: form.camera.position,
    })
  },
  initCamera() {
    world.value.core.on("Render", (_delta: number) => {
      form.camera.fov = world.value.core.camera.fov
      form.camera.aspect = world.value.core.camera.aspect
      form.camera.near = world.value.core.camera.near
      form.camera.far = world.value.core.camera.far
      form.camera.position.x = world.value.core.camera.position.x
      form.camera.position.y = world.value.core.camera.position.y
      form.camera.position.z = world.value.core.camera.position.z
    })
  },
  orbitUpdate: useDebounceFn(
    () => {
      world.value.core.orbitCtrls.enabled = form.orbit.enabled
      world.value.core.orbitCtrls.minDistance = form.orbit.minDistance
      world.value.core.orbitCtrls.maxDistance = form.orbit.maxDistance
      world.value.core.orbitCtrls.minZoom = form.orbit.minZoom
      world.value.core.orbitCtrls.maxZoom = form.orbit.maxZoom
      world.value.core.orbitCtrls.minTargetRadius = form.orbit.minTargetRadius
      world.value.core.orbitCtrls.maxTargetRadius = form.orbit.maxTargetRadius
      world.value.core.orbitCtrls.minPolarAngle = form.orbit.minPolarAngle // 0 to Math.PI radians
      world.value.core.orbitCtrls.maxPolarAngle = form.orbit.maxPolarAngle // 0 to Math.PI radians
      world.value.core.orbitCtrls.minAzimuthAngle = form.orbit.minAzimuthAngle
      world.value.core.orbitCtrls.maxAzimuthAngle = form.orbit.maxAzimuthAngle
      world.value.core.orbitCtrls.enableDamping = form.orbit.enableDamping
      world.value.core.orbitCtrls.dampingFactor = form.orbit.dampingFactor
      world.value.core.orbitCtrls.enableZoom = form.orbit.enableZoom
      world.value.core.orbitCtrls.zoomSpeed = form.orbit.zoomSpeed
      world.value.core.orbitCtrls.zoomToCursor = form.orbit.zoomToCursor
      world.value.core.orbitCtrls.enableRotate = form.orbit.enableRotate
      world.value.core.orbitCtrls.rotateSpeed = form.orbit.rotateSpeed
      world.value.core.orbitCtrls.enablePan = form.orbit.enablePan
      world.value.core.orbitCtrls.panSpeed = form.orbit.panSpeed
      world.value.core.orbitCtrls.screenSpacePanning = form.orbit.screenSpacePanning
      world.value.core.orbitCtrls.keyPanSpeed = form.orbit.keyPanSpeed
      world.value.core.orbitCtrls.autoRotate = form.orbit.autoRotate
      world.value.core.orbitCtrls.autoRotateSpeed = form.orbit.autoRotateSpeed
    },
    300,
    {
      maxWait: 600,
    }
  ),
  initOrbitControls() {
    const init = () => {
      form.orbit.enabled = props.world.core.orbitCtrls.enabled
      form.orbit.minDistance = props.world.core.orbitCtrls.minDistance
      form.orbit.maxDistance = props.world.core.orbitCtrls.maxDistance
      form.orbit.minZoom = props.world.core.orbitCtrls.minZoom
      form.orbit.maxZoom = props.world.core.orbitCtrls.maxZoom
      form.orbit.minTargetRadius = props.world.core.orbitCtrls.minTargetRadius
      form.orbit.maxTargetRadius = props.world.core.orbitCtrls.maxTargetRadius
      form.orbit.minPolarAngle = props.world.core.orbitCtrls.minPolarAngle // 0 to Math.PI radians
      form.orbit.maxPolarAngle = props.world.core.orbitCtrls.maxPolarAngle // 0 to Math.PI radians
      form.orbit.minAzimuthAngle = props.world.core.orbitCtrls.minAzimuthAngle
      form.orbit.maxAzimuthAngle = props.world.core.orbitCtrls.maxAzimuthAngle
      form.orbit.enableDamping = props.world.core.orbitCtrls.enableDamping
      form.orbit.dampingFactor = props.world.core.orbitCtrls.dampingFactor
      form.orbit.enableZoom = props.world.core.orbitCtrls.enableZoom
      form.orbit.zoomSpeed = props.world.core.orbitCtrls.zoomSpeed
      form.orbit.zoomToCursor = props.world.core.orbitCtrls.zoomToCursor
      form.orbit.enableRotate = props.world.core.orbitCtrls.enableRotate
      form.orbit.rotateSpeed = props.world.core.orbitCtrls.rotateSpeed
      form.orbit.enablePan = props.world.core.orbitCtrls.enablePan
      form.orbit.panSpeed = props.world.core.orbitCtrls.panSpeed
      form.orbit.screenSpacePanning = props.world.core.orbitCtrls.screenSpacePanning
      form.orbit.keyPanSpeed = props.world.core.orbitCtrls.keyPanSpeed
      form.orbit.autoRotate = props.world.core.orbitCtrls.autoRotate
      form.orbit.autoRotateSpeed = props.world.core.orbitCtrls.autoRotateSpeed
    }
    // props.world.core.on("OrbitChanged", () => {
    //   init()
    // })
    init()
  },
}

function init() {
  hdl.initCamera()
  hdl.initOrbitControls()
}
onMounted(init)
</script>
<style lang="scss" scoped>
:deep(.el-input-number) {
  width: 100%;
}
</style>
