<script setup lang="ts">
import { Copy } from "@toolmain/components"
import { ref } from "vue"
const text = ref('<Copy text="copy text"></Copy>')
</script>
<template>
  <el-card class="w-full">
    <template #header>
      <el-text>Copy</el-text>
    </template>
    <el-text>{{ text }}</el-text>
    <template #footer>
      <Copy :text></Copy>
    </template>
  </el-card>
</template>
<div class="p-1rem w-full h-full relative flex">
  </div>
<style lang="scss" scoped></style>
