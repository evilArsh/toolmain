<script lang="ts" setup>
import { CSSProperties, getStyleValue, px } from "@toolmain/shared"
import { ScaleConfig, useScale, ScaleEv } from "@toolmain/components"
import { ref, computed, onBeforeUnmount } from "vue"

const props = defineProps<{
  /**
   * 大小,水平移动时指定为宽度,垂直移动时指定为高度
   */
  size: number | string
  /**
   * 方向
   */
  direction: "top" | "right" | "bottom" | "left"
  /**
   * 目标元素
   */
  target?: HTMLElement | null
  modelValue: CSSProperties
}>()
const emit = defineEmits<{
  (e: "update:modelValue", value: CSSProperties): void
  (e: "afterScale"): void
  (e: "scaling"): void
}>()

const scaleConfig = ref<ScaleConfig>({
  containerStyle: props.modelValue,
})
const { onMouseDown, on, dispose } = useScale({
  config: scaleConfig,
  targetEle: computed<Readonly<HTMLElement | null | undefined>>(() => props.target),
})
const handlerStyle = computed<CSSProperties>(() => {
  switch (props.direction) {
    case "top":
      return { height: px(props.size), top: 0, left: 0, right: 0, cursor: "ns-resize" }
    case "bottom":
      return { height: px(props.size), left: 0, right: 0, bottom: 0, cursor: "ns-resize" }
    case "right":
      return { width: px(props.size), top: 0, bottom: 0, right: 0, cursor: "ew-resize" }
    case "left":
      return { width: px(props.size), left: 0, top: 0, bottom: 0, cursor: "ew-resize" }
    default:
      return {}
  }
})
const isRight = computed<boolean>(() => props.direction == "right")
const isLeft = computed<boolean>(() => props.direction == "left")
const isTop = computed<boolean>(() => props.direction == "top")
const isBottom = computed<boolean>(() => props.direction == "bottom")

const barWidth = computed<string>(() => (isRight.value || isLeft.value ? "2px" : "100%"))
const barHeight = computed<string>(() => (isRight.value || isLeft.value ? "100%" : "2px"))
const barRight = computed<string>(() => (isRight.value ? "0" : "unset"))
const barTop = computed<string>(() => (isTop.value ? "0" : "unset"))
const barleft = computed<string>(() => (isLeft.value ? "0" : "unset"))
const barBottom = computed<string>(() => (isBottom.value ? "0" : "unset"))

on(ScaleEv.SCALING, () => {
  emit("update:modelValue", {
    width: getStyleValue("width", scaleConfig.value.containerStyle?.width),
    height: getStyleValue("height", scaleConfig.value.containerStyle?.height),
  })
  emit("scaling")
})
on(ScaleEv.AFTER_SCALE, () => {
  emit("afterScale")
})
onBeforeUnmount(dispose)
</script>
<template>
  <div class="resize-handler" :style="handlerStyle" @mousedown="onMouseDown($event, props.direction)"></div>
</template>
<style lang="scss" scoped>
.resize-handler {
  --resize-bg: transparent;
  --resize-hover-bg: var(--el-color-primary);
  --resize-active-bg: var(--el-color-primary);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: "";
    position: absolute;
    width: v-bind(barWidth);
    height: v-bind(barHeight);
    left: v-bind(barleft);
    top: v-bind(barTop);
    bottom: v-bind(barBottom);
    right: v-bind(barRight);
    background-color: var(--resize-bg);
  }
  &:hover {
    &::before {
      background-color: var(--resize-hover-bg);
    }
  }
  &:active {
    &::before {
      background-color: var(--resize-active-bg);
    }
  }
}
</style>
