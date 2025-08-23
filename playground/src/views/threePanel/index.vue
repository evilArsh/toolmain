<script setup lang="ts">
import { LightType, ThreePanel, ThreePanelConf } from "@toolmain/components"
import { ref } from "vue"

const defaultConf = (): ThreePanelConf => {
  return {
    renderer: {
      clearColor: "#baedff",
    },
    control: {
      target: {
        x: 3.9132939725306395,
        y: 5.848378258883859,
        z: -8.140733493782484,
      },
    },
    camera: {
      position: {
        x: 45.40059637472193,
        y: 37.727075070360165,
        z: -8.236756094389934,
      },
    },
    lights: [
      {
        id: "01K2P404NFMY4321WR4NZV9XVX",
        type: LightType.DirectionalLight,
        color: "#ffffff",
        position: {
          x: -29.0927614224809,
          y: 4.205738360098595,
          z: 0.8320454668048249,
        },
        name: "直线光",
        groundColor: "#ffffff",
        rotate: {
          x: 0,
          y: 0,
          z: 0,
        },
        visible: true,
        helperColor: "#ffffff",
        helperSize: 3,
        decay: 2,
        intensity: 3,
        distance: 0,
        angle: 1.5707963267948966,
      },
      {
        id: "01K2P41MJMTFS05B323TS762CC",
        type: LightType.DirectionalLight,
        color: "#ffffff",
        position: {
          x: 8.672091377088975,
          y: 29.554258070626243,
          z: -0.23272147448348868,
        },
        name: "直线光",
        groundColor: "#ffffff",
        rotate: {
          x: 0,
          y: 0,
          z: 0,
        },
        visible: true,
        helperColor: "#ffffff",
        helperSize: 3,
        decay: 2,
        intensity: 2,
        distance: 0,
        angle: 1.5707963267948966,
      },
      {
        id: "01K2P44VWWJNA4WY9JA7CQYQTE",
        type: LightType.PointLight,
        color: "#ffffff",
        position: {
          x: 13.756006296230563,
          y: 7.241698502312563,
          z: -39.64101030879818,
        },
        name: "点光",
        groundColor: "#ffffff",
        rotate: {
          x: 0,
          y: 0,
          z: 0,
        },
        visible: true,
        helperColor: "#ffffff",
        helperSize: 3,
        decay: 2,
        intensity: 100,
        distance: 0,
        angle: 1.5707963267948966,
      },
    ],
    url: `https://threejs.org/examples/models/gltf/LittlestTokyo.glb`,
  }
}
const config = ref<ThreePanelConf>(defaultConf())
</script>
<template>
  <div class="p-1rem w-full h-full">
    <ThreePanel :config debug></ThreePanel>
  </div>
</template>
<style lang="scss" scoped></style>
