<script setup lang="ts">
import { Affix } from "@toolmain/components"
import { localImg } from "@toolmain/shared"
</script>
<template>
  <div class="p-1rem bg-gray w-full h-full relative flex">
    <Affix>
      <el-button>按钮</el-button>
      <el-image class="w-50rem h-50rem" :src="localImg('test.jpg')"></el-image>
    </Affix>
    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped></style>
