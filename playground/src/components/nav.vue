<script lang="ts" setup>
import { CSSProperties } from "@toolmain/shared"
import { Resize } from "@toolmain/components"
import { ref, useTemplateRef } from "vue"
const scaleRef = useTemplateRef("scale")
const targetStyle = ref<CSSProperties>({
  width: "350px",
})
</script>
<template>
  <div class="subnav-container">
    <div class="subnav-provider" :style="targetStyle" ref="scale">
      <el-card class="subnav-card" body-class="flex flex-1 flex-col overflow-hidden" shadow="never">
        <slot name="submenu"></slot>
      </el-card>
      <Resize v-model="targetStyle" size="8px" direction="right" :target="scaleRef" />
    </div>
    <div class="subnav-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.subnav-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  gap: var(--ai-gap-base);
  .subnav-provider {
    overflow: hidden;
    min-width: 20rem;
    background-color: var(--el-bg-color);
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .subnav-card {
    --el-card-border-color: transparent;
    --el-card-padding: 0.25rem;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    overflow: hidden;
  }
  .subnav-content {
    overflow: hidden;
    display: flex;
    flex: 1;
  }
}
</style>
