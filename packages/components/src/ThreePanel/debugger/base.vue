<template>
  <div class="flex flex-col gap10px">
    <el-descriptions title="基础信息" :column="3" border>
      <el-descriptions-item label="快捷键" :span="3">
        <div class="flex flex-wrap gap-1rem">
          <el-tag>m: toggle控制面板</el-tag>
          <el-tag>w/a/s/d: 人物移动</el-tag>
          <el-tag>shift: 人物跑步</el-tag>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import { ElDescriptions, ElDescriptionsItem, ElTag } from "element-plus"
import { onMounted, reactive } from "vue"
import { World } from "../three"
const props = defineProps<{
  world: World
}>()
const form = reactive({
  // 随机日志
  rand: {
    code: 0,
    msg: "",
  },
  keydownCode: "",
  log: [] as {
    code: number
    msg: string
    data?: { type?: string; data?: unknown }
  }[],
})

function init() {
  props.world.core.on("Log", (e: { code: number; msg: string; data?: { type?: string; data?: unknown } }) => {
    form.log.unshift(e)
  })
}
onMounted(init)
</script>
