<template>
  <div class="h-100% flex flex-col relative gap-5px">
    <div>
      <el-input v-model="keyword" placeholder="搜索">
        <template #prefix>
          <i class="i-ep:search"></i>
        </template>
      </el-input>
      <el-slider v-model="showCols" :step="1" :min="2" :max="10" show-stops />
    </div>
    <el-scrollbar>
      <el-collapse v-model="collapses">
        <el-collapse-item
          v-for="item in tree"
          :key="item.value"
          :title="`${item.label} ${item.value}`"
          :name="item.value">
          <div class="components-wrapper">
            <el-card
              v-for="data in item.list"
              :key="data.raw.label"
              :draggable="true"
              class="hover:border-dashed hover:border-color-#1c8bd4 hover:c-#1c8bd4"
              shadow="hover"
              @dblclick="onDblClick($event, data.raw)"
              @dragend="onDragend($event, data.raw)"
              @dragstart="onDragstart($event, data.raw)">
              <div class="flex items-center gap-5px">
                <component :is="data.icon" class="text-16px"></component>
                <el-text :line-clamp="1">{{ data.raw.label }}</el-text>
              </div>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { ElInput, ElSlider, ElScrollbar, ElCollapse, ElCollapseItem, ElCard, ElText } from "element-plus"
import { cloneDeep } from "@toolmain/shared"
import type { ComponentLibrary, ComponentProvider, ComponentUIGroup, DeliverParam, RawComponent } from "../../types"
import { computed, ref } from "vue";
const props = defineProps<{
  lib: ComponentLibrary
  provider: ComponentProvider
  configs: RawComponent[]
  typeMaps: Record<string, ComponentUIGroup>
}>()
const typeKeys = computed(() => Object.keys(props.typeMaps))
const collapses = ref(typeKeys.value)
const showCols = ref(3)

const keyword = ref("")

const filterList = computed<RawComponent[]>((): RawComponent[] =>
  props.configs.filter(item => {
    const key = keyword.value.trim().toLowerCase()
    return item.label.toLowerCase().includes(key)
  })
)
const configsMap = computed(() => {
  return props.configs.reduce(
    (acc, cur) => {
      const key = cur.label
      acc[key] = cur
      return acc
    },
    {} as Record<string, RawComponent>
  )
})
const tree = computed(() => {
  return Object.entries(props.typeMaps).map(([key, data]) => {
    return {
      label: data.label,
      value: key,
      list: data.list
        .filter(raw => filterList.value.findIndex(l => l.label === raw.label) > -1)
        .map(raw => {
          return {
            icon: raw.icon,
            raw: configsMap.value[raw.label],
          }
        }),
    }
  })
})
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
  grid-template-columns: repeat(v-bind(showCols), 1fr);
  gap: 5px;
  .el-card {
    --el-card-padding: 5px;
  }
}
</style>
<style></style>
