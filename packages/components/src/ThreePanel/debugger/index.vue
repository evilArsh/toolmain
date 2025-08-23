<template>
  <ScalePanel ref="scaleRef" v-model="conf">
    <template #header>
      <div class="flex justify-between">
        <el-text type="primary">threejs 调试控制台,用于本地开发和测试v2.0</el-text>
      </div>
    </template>
    <div class="px-10px py-10px w-100% h-100%">
      <el-collapse v-model="sw.collapseActive">
        <el-collapse-item title="基础配置" :name="1">
          <el-tabs v-model="sw.tabBase">
            <el-tab-pane label="模型" :name="0">
              <Model :world="world"></Model>
            </el-tab-pane>
            <el-tab-pane label="光源" :name="1">
              <Lights v-if="lights" :world="world" :lights></Lights>
            </el-tab-pane>
            <el-tab-pane label="相机" :name="2">
              <Camera :world="world"></Camera>
            </el-tab-pane>
            <el-tab-pane label="请求日志" :name="3">
              <Log :world="world"></Log>
            </el-tab-pane>
            <el-tab-pane label="渲染器" :name="4">
              <Renderer :world="world"></Renderer>
            </el-tab-pane>
            <el-tab-pane label="基础信息" :name="5">
              <Base :world="world"></Base>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
        <el-collapse-item title="额外配置" :name="2">
          <el-tabs v-model="sw.tabExtra">
            <el-tab-pane v-for="(item, index) in panels" :key="item.id" :label="item.label" :name="index + 1">
              <component :is="item.node"></component>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </div>
  </ScalePanel>
</template>
<script lang="ts" setup>
import { ScalePanel } from "@toolmain/components"
import { useScale } from "./useScale"
import Log from "./log.vue"
import Base from "./base.vue"
import Model from "./model.vue"
import Camera from "./camera.vue"
import Lights from "./lights.vue"
import Renderer from "./renderer.vue"
import useDebugger from "./useDebugger"
import { storeToRefs } from "pinia"
import { LightMeta, World } from "../three"
import { onMounted, reactive, ref } from "vue"
import { ScaleInstance } from "@toolmain/components"
const uDebugger = useDebugger()
const { panels } = storeToRefs(uDebugger)
const { conf } = useScale()
const scaleRef = ref<ScaleInstance>()
const props = defineProps<{
  world: World
  lights?: Array<LightMeta>
}>()
const sw = reactive({
  collapseActive: 1,
  tabBase: 1,
  tabExtra: 1,
})
function init() {
  scaleRef.value?.hideTo("right", false)
  props.world.core.keyboard.ev.on("KeyM", (s: boolean) => {
    if (!s) return
    if (conf.value.visible) {
      scaleRef.value?.hideTo("right", true)
    } else {
      scaleRef.value?.show(true, "right")
    }
  })
}
onMounted(init)
</script>
