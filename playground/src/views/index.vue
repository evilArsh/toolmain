<script setup lang="ts">
import { Affix } from "@toolmain/components"
import { localImg } from "@toolmain/shared"
</script>
<template>
  <div class="p-1rem bg-gray">
    <Affix>
      <el-button>按钮</el-button>
      <el-image class="w-50rem h-50rem" :src="localImg('test.jpg')"></el-image>
    </Affix>
  </div>
</template>
<style lang="scss" scoped></style>
