<template>
  <div class="h-100% flex flex-col relative gap-5px">
    <div>
      <el-input v-model="keyword" placeholder="搜索组件">
        <template #prefix>
          <i class="i-ep-search"></i>
        </template>
      </el-input>
      <el-slider v-model="showCols" :step="1" :min="2" :max="10" show-stops />
    </div>
    <el-scrollbar>
      <el-card
        v-for="child in filterList"
        :key="child.label"
        :draggable="true"
        @dblclick="onDblClick($event, child)"
        @dragend="onDragend($event, child)"
        @dragstart="onDragstart($event, child)">
        <template #header>{{ child.label }}</template>
      </el-card>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { cloneDeep } from "@toolmain/shared"
import { ElInput, ElSlider, ElScrollbar, ElCard } from "element-plus"
import type { ComponentLibrary, ComponentProvider, DeliverParam, RawComponent } from "../../../types"
import { computed, ref } from "vue"
const props = defineProps<{
  lib: ComponentLibrary
  provider: ComponentProvider
}>()
const allComponents = props.lib.getRawConfig() // 所有组件

const showCols = ref(3) // 组件显示列数

const keyword = ref("")
const filterList = computed<RawComponent[]>((): RawComponent[] =>
  allComponents.filter(item => {
    const key = keyword.value.trim().toLowerCase()
    return item.label.toLowerCase().includes(key)
  })
)

function generateParam(e: DragEvent, item: RawComponent): DeliverParam {
  return {
    raw: cloneDeep(item),
    clientX: e.clientX,
    clientY: e.clientY,
  }
}
function onDragstart(e: DragEvent, item: RawComponent) {
  const src = generateParam(e, item)
  props.provider.setCurrent(src)
  props.provider.emit("InstanceDragstart", src)
}
function onDragend(e: DragEvent, item: RawComponent) {
  const src = generateParam(e, item)
  props.provider.setCurrent(src)
  props.provider.emit("InstanceDragend", src)
}
// 双击组件
function onDblClick(e: DragEvent, item: RawComponent) {
  props.provider.emit("RawDbClick", generateParam(e, item))
}
</script>
<style lang="scss" scoped>
.components-wrapper {
  cursor: pointer;
  display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-template-columns: repeat(v-bind(showCols), 1fr);
  gap: 16px;
  .el-card {
    --el-card-padding: 5px;
    .el-card__body {
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      aspect-ratio: 280 / 180;
      svg {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
<style></style>
