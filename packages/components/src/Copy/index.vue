<script setup lang="ts">
import { useCopy } from "@toolmain/shared"
import { ElButton } from "element-plus"
const { copied, onCopy } = useCopy()
defineProps<{
  text: string
}>()
</script>
<template>
  <ElButton type="primary" @click="onCopy(text)" size="small" round plain circle>
    <slot :text :copied>
      <i-ic-outline-check v-if="copied"></i-ic-outline-check>
      <i-ic-baseline-content-copy v-else></i-ic-baseline-content-copy>
    </slot>
  </ElButton>
</template>
<style lang="scss" scoped></style>
