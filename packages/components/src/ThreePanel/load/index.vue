<template>
  <Fullscreen v-model="load.full" :finish="initFinish" :world="world"></Fullscreen>
  <Tip v-model="load.tip"></Tip>
</template>
<script lang="ts" setup>
import Fullscreen from "./fullscreen.vue"
import Tip from "./tip.vue"
import { LoadParam, World } from "../three"
import { reactive, computed, watch, onMounted, onBeforeUnmount } from "vue"
const props = defineProps<{ world: World }>()
const load = reactive({
  inited: false,
  tip: { url: "", describe: "", loaded: 0, total: 0 } as LoadParam,
  full: { url: "", describe: "", loaded: 0, total: 0 } as LoadParam,
  /**
   * 全屏加载用于初始化加载的资源
   */
  initFinish: { bot: false, scene: false },
})
const initFinish = computed(() => load.initFinish.bot && load.initFinish.scene)
function progressHandle(data: LoadParam) {
  const percentage = data.total ? (data.loaded / data.total) * 100 : 0
  data.describe = "资源加载中..."
  const url = data.url.toUpperCase()
  if (/.*\.(blob|glb|fbx)$/i.test(url)) {
    data.describe = "加载模型中..."
  }
  if (url.endsWith("wasm")) {
    data.describe = "加载wasm中..."
  }
  if (/.*\.(jpg|png|jpeg|bmp|gif)$/i.test(url)) {
    data.describe = "加载图片素材中..."
  }
  if (/.*\.(m4a|mp3|wav)$/i.test(url)) {
    data.describe = "加载声音资源中..."
  }
  if (percentage === 100) {
    data.describe = "加载完成"
  }
}
watch(
  () => props.world,
  () => {
    if (props.world.bot && props.world.scene) {
      init()
    }
  },
  { immediate: true, deep: true }
)
function init() {
  if (load.inited) return
  if (!props.world.bot) load.initFinish.bot = true
  if (!props.world.scene) load.initFinish.scene = true
  props.world.core.on("LoadProgress", e => {
    console.log("[core LoadProgress]", e)
    progressHandle(e)
    load.tip = e
  })
  props.world.scene?.loader.on("LoadProgress", e => {
    load.initFinish.scene = false
    // console.log("[scene LoadProgress]", e)
    progressHandle(e)
    load.full = e
  })
  props.world.scene?.loader.on("Loaded", () => {
    console.log("[scene Loaded]")
    load.initFinish.scene = true
  })
  props.world.scene?.loader.on("LoadError", e => {
    console.log("[scene LoadError]", e)
    load.initFinish.scene = true
  })
  load.inited = true
}
onMounted(init)
onBeforeUnmount(() => {})
</script>
<style lang="scss" scoped>
.name {
  background: linear-gradient(313deg, #3525d6 0%, #5072ff 100%);
  box-shadow:
    0rem 0.25rem 1.25rem 0rem rgba(0, 0, 0, 0.11),
    0rem 0.25rem 1.25rem 0rem rgba(57, 48, 220, 0.3);
  border-radius: 1.5rem;
  filter: blur(0px);
  padding: 10px 20px;
}
</style>
