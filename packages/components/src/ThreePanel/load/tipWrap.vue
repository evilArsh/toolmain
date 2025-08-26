<template>
  <div v-if="percentage" class="flex flex-col gap-10px">
    <div class="flex flex-col gap-5px">
      <span class="flex flex-col gap-5px text-30px">
        <span class="text-16px oneline">{{ url }}</span>
        <span class="text-12px oneline">{{ props.data.describe }}</span>
      </span>
    </div>
    <div>
      <el-progress
        style="--el-color-danger: #fc0024"
        class="w-100%"
        :text-inside="true"
        :stroke-width="18"
        :percentage
        status="exception"
        striped
        striped-flow
        :duration="20">
      </el-progress>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue"
import { LoadParam } from "../three"
import { ElProgress } from "element-plus"

const props = defineProps<{
  data: LoadParam
}>()
const percentage = computed(() => (props.data.total ? Math.floor((props.data.loaded / props.data.total) * 100) : 0))
const url = computed(() => {
  return props.data.url.slice(props.data.url.lastIndexOf("/") + 1)
})
</script>
