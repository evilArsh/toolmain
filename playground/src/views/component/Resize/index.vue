<script lang="ts" setup>
import { Resize } from "@toolmain/components"
import { CSSProperties } from "@toolmain/shared"
import { ref, useTemplateRef } from "vue"

const targetLeftStyle = ref<CSSProperties>({})
const targetTopStyle = ref<CSSProperties>({})
const targetRightStyle = ref<CSSProperties>({})
const targetBottomStyle = ref<CSSProperties>({})
const targetLeft = useTemplateRef("targetLeft")
const targetTop = useTemplateRef("targetTop")
const targetRight = useTemplateRef("targetRight")
const targetBottom = useTemplateRef("targetBottom")
</script>
<template>
  <div class="w-full h-full flex flex-col gap-2rem p2rem">
    <div border="dashed 1px red" class="p-3rem h-20rem relative flex">
      <el-tag class="absolute left-0 bottom-0 z-100">left</el-tag>
      <div class="card flex-1 flex-center">
        <el-text type="primary">content</el-text>
      </div>
      <div ref="targetLeft" :style="targetLeftStyle" class="card relative h-full flex-center flex-shrink-0 max-w-full">
        <Resize v-model="targetLeftStyle" :target="targetLeft" size="3px" direction="left" />
        <el-text type="primary">target</el-text>
      </div>
    </div>

    <div border="dashed 1px red" class="p-3rem relative flex flex-col h-30rem overflow-hidden">
      <el-tag class="absolute left-0 bottom-0 z-100">top</el-tag>
      <div class="card flex-1 flex-center">
        <el-text type="primary">content</el-text>
      </div>
      <div ref="targetTop" :style="targetTopStyle" class="card flex-center flex-shrink-0 relative">
        <Resize v-model="targetTopStyle" :target="targetTop" size="3px" direction="top" />
        <el-text type="primary">target</el-text>
      </div>
    </div>

    <div border="dashed 1px red" class="p-3rem h-20rem relative flex">
      <el-tag class="absolute left-0 bottom-0 z-100">right</el-tag>
      <div ref="targetRight" :style="targetRightStyle" class="card relative h-full flex-shrink-0 flex-center">
        <Resize v-model="targetRightStyle" :target="targetRight" size="3px" direction="right" />
        <el-text type="primary">target</el-text>
      </div>
      <div class="card flex-1 flex-center">
        <el-text type="primary">content</el-text>
      </div>
    </div>

    <div border="dashed 1px red" class="p-3rem relative flex flex-col h-30rem overflow-hidden">
      <el-tag class="absolute left-0 bottom-0 z-100">bottom</el-tag>
      <div ref="targetBottom" :style="targetBottomStyle" class="card flex-center flex-shrink-0 relative">
        <Resize v-model="targetBottomStyle" :target="targetBottom" size="3px" direction="bottom" />
        <el-text type="primary">target</el-text>
      </div>
      <div class="card flex-1 flex-center">
        <el-text type="primary">content</el-text>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  --el-card-border-color: var(--el-border-color-light);
  --el-card-border-radius: 4px;
  --el-card-padding: 20px;
  --el-card-bg-color: var(--el-fill-color-blank);
  background-color: var(--el-card-bg-color);
  border: 1px solid var(--el-card-border-color);
  border-radius: var(--el-card-border-radius);
  color: var(--el-text-color-primary);
  overflow: hidden;
}
</style>
