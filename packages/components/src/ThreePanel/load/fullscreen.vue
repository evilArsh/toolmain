<template>
  <!-- <div v-if="!finish" class="wrap fixed z-100 left-0 right-0 top-0 bottom-0 flex items-center justify-center"> -->
  <div v-show="!finish" class="wrap absolute z-100 left-0 right-0 top-0 bottom-0 flex items-center justify-center">
    <div class="flex flex-col gap-10px w-50% items-center text-30px">
      <el-progress
        style="--el-color-danger: #005ed8"
        class="w-100%"
        :text-inside="true"
        :stroke-width="27"
        :percentage
        status="exception"
        striped
        striped-flow
        :duration="20">
        <span class="c-#000">{{ percentage }}%</span>
      </el-progress>
      <p class="mt-20px text-16px c-#fff">模型加载中...</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch } from "vue"
import { LoadParam, World } from "../three"
const emit = defineEmits<{
  "update:modelValue": [data: LoadParam]
}>()
const props = defineProps<{
  world: World
  modelValue: LoadParam
  finish: boolean
}>()
const load = computed<LoadParam>({
  get: () => props.modelValue,
  set: (val: LoadParam) => {
    emit("update:modelValue", val)
  },
})
const percentage = computed(() => (load.value.total ? Math.floor((load.value.loaded / load.value.total) * 100) : 0))
watch(
  () => props.finish,
  v => {
    if (v) {
      props.world.core.emit("Loaded")
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.wrap {
  // background-image: url(/src/assets/img/login-background.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
:deep(.el-progress-bar__innerText) {
  height: 100%;
}
:deep(.el-progress-bar__outer) {
  border: solid 2px #fff;
}
</style>
