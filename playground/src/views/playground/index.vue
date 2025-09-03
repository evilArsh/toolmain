<script setup lang="ts">
import { RouterView } from "vue-router"
import { initNode } from "@/routes/index"

const useMenu = () => {
  const node = initNode.iterNode(node => {
    return node.getPath().endsWith(".vue") ? undefined : node
  })
  console.log(node)
  return {
    node,
  }
}
const { node } = useMenu()
</script>
<template>
  <div class="flex">
    <div>root</div>
    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped></style>
