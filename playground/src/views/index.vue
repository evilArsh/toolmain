<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router"
import { initRoutes } from "@/routes/index"
import { markRaw, reactive, shallowRef, watchEffect } from "vue"
import { Router } from "@toolmain/libs"
import { CSSProperties } from "@toolmain/shared"
import { Resize } from "@toolmain/components"
import { ref } from "vue"

const targetStyle = ref<CSSProperties>({
  width: "350px",
})
const router = useRouter()
const route = useRoute()
const useMenu = () => {
  const node = shallowRef(initRoutes)
  return {
    node,
  }
}
const { node } = useMenu()
const tree = reactive({
  current: "",
  props: {
    label: "path",
    children: "children",
    isLeaf: "isLeaf",
  },
  onNodeClick: markRaw((data: Router) => {
    tree.current = data.fullPath
    router.push(data.fullPath)
  }),
})
watchEffect(() => {
  tree.current = route.path
})
</script>
<template>
  <div class="main-container">
    <div class="main-aside"></div>
    <div class="main-content">
      <!-- <div class="main-content-header"></div> -->
      <div class="main-content-inner">
        <div class="subnav-container">
          <div class="subnav-provider" :style="targetStyle">
            <Resize v-model="targetStyle" size="8px" direction="right" />
            <el-card class="subnav-card" body-class="flex flex-1 flex-col overflow-hidden" shadow="never">
              <el-scrollbar>
                <el-tree
                  :current-node-key="tree.current"
                  :data="node"
                  :props="tree.props"
                  node-key="fullPath"
                  :expand-on-click-node="false"
                  default-expand-all
                  highlight-current
                  @node-click="tree.onNodeClick"></el-tree>
              </el-scrollbar>
            </el-card>
          </div>
          <div class="subnav-content">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
:root {
  --ai-header-height: 40px;
  --ai-gap-small: 3px;
  --ai-gap-base: 5px;
  --ai-gap-medium: 10px;
  --ai-gap-large: 16px;
  --ai-gap-extre-large: 24px;
}
</style>
<style lang="scss" scoped>
.main-container {
  background-color: var(--el-bg-color-page);
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  .main-aside {
    overflow: hidden;
    display: flex;
  }
  .main-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: var(--ai-gap-base);
  }
  .main-content-header {
    height: var(--ai-header-height);
    padding-right: 140px;
    background-color: var(--el-bg-color);
    border-bottom-left-radius: var(--el-border-radius-base);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .main-content-inner {
    flex: 1;
    overflow: hidden;
    display: flex;
    margin: 0 var(--ai-gap-base) var(--ai-gap-base) 0;
    border-radius: var(--el-border-radius-base);
  }
}
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
