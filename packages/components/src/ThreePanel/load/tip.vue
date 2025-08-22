<template>
  <div v-show="showTip" class="tipWrap flex flex-col gap-10px">
    <div @click="showTip = false" class="close flex items-center justify-center cursor-pointer hover:bg-gray-500">
      <i class="i-ep:close text-12px"></i>
    </div>
    <TipWrap :data="single.data" v-show="showSingle"></TipWrap>
    <div v-for="item in independent.dataList" :key="item.url" class="flex flex-col gap-10px">
      <TipWrap :data="item"></TipWrap>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import { LoadParam } from "../three"
import TipWrap from "./tipWrap.vue"
import { computed, reactive, watchEffect } from "vue"
const emit = defineEmits<{
  "update:modelValue": [data: LoadParam]
}>()
const props = defineProps<{ modelValue: LoadParam }>()
const load = computed<LoadParam>({
  get: () => props.modelValue,
  set: (val: LoadParam) => {
    emit("update:modelValue", val)
  },
})
const showTip = computed(() => independent.dataList.length > 0 || single.data.total !== single.data.loaded)
const showSingle = computed(() => single.data.total > 0 && single.data.loaded !== single.data.total)
const independent = reactive({
  data: new Map<string, LoadParam>(),
  dataList: [] as LoadParam[],
})
const single = reactive({
  data: { loaded: 0, total: 0 } as LoadParam,
})
watchEffect(() => {
  if (load.value.independent) {
    if (load.value.loaded === load.value.total) {
      independent.data.delete(load.value.url)
    } else {
      independent.data.set(load.value.url, { ...load.value })
    }
    independent.dataList = Array.from(independent.data.values())
  } else {
    single.data = { ...load.value }
    // Object.assign(single.data, load.value)
  }
})
</script>
<style lang="scss" scoped>
.close {
  position: absolute;
  right: 0;
  top: 0;
  border-top-right-radius: 8px;
  background: red;
  width: 20px;
  height: 20px;
  border-bottom-left-radius: 8px;
}
.tipWrap {
  color: #fff;
  position: absolute;
  right: 10px;
  top: 10px;
  width: 330px;
  padding: 3px 6px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid #707070;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.12);
  transition:
    opacity 0.3s,
    transform 0.3s,
    left 0.3s,
    right 0.3s,
    top 0.4s,
    bottom 0.3s;
  overflow-wrap: break-word;
  overflow: hidden;
  z-index: 101;
  .oneline {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
:deep(.el-progress-bar__innerText) {
  height: 100%;
}
:deep(.el-progress-bar__outer) {
  border: solid 2px #fff;
}
</style>
