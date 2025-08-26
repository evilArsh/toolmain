<template>
  <div class="flex flex-col">
    <el-row>
      <el-form-item label="clearColor">
        <el-color-picker v-model="form.clearColor" @change="onColorChange" />
      </el-form-item>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { ElRow, ElFormItem, ElColorPicker } from "element-plus"
import { reactive, onMounted } from "vue"
import { World } from "../three"
import * as THREE from "three"

const props = defineProps<{
  world: World
}>()
const form = reactive({
  clearColor: "",
})
function onColorChange() {
  props.world.core.renderer.setClearColor(new THREE.Color(form.clearColor))
}
function init() {}
onMounted(init)
</script>
