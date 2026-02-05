<script lang="ts" setup>
import { px } from "@toolmain/shared"
import { useElementBounding, useThrottleFn } from "@vueuse/core"
import { CSSProperties, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from "vue"
import { Direction, getTargetEl, useIntersection } from "./intersection"
const {
  position = "top",
  target = "",
  offset = 0,
} = defineProps<{
  /**
   * 选择top时，如果元素滚动到[底部]消失或即将消失，会回到原位置
   *
   * 选择bottom时则是滚动到[顶部]时触发
   */
  position?: "top" | "bottom"
  /**
   * element query selector
   */
  target?: string
  offset?: number
}>()
/**
 * 当前固钉
 */
const affixRef = useTemplateRef("affix")
const affixInner = useTemplateRef("affixInner")
/**
 * 当前固钉定位时参考元素
 */
const targetEl = shallowRef<HTMLElement | null>(null)
/**
 * 当前固钉包裹的子元素
 */
const childEl = shallowRef<HTMLElement | null>()
const { width, height } = useElementBounding(childEl)

const { affixX, affixY, onUpdate, affixHeight, event, updateAffixBounding } = useIntersection(affixRef, targetEl)

const affixStyle = shallowRef<CSSProperties>({})
const affixScale = shallowRef<CSSProperties>({})

const needReCalc = () => {
  // console.log(
  //   `[参考元素可视 ${event.target.isIntersecting} ${event.target.intersectionRatio}]
  // [固钉可视 ${event.affix.isIntersecting} ${event.affix.intersectionRatio}]`
  // )
  // 有参考元素
  if (targetEl.value) {
    // 【参考元素可视】并且(【固钉不可视】或者【部分可视】)
    if (event.target.isIntersecting) {
      if (!event.affix.isIntersecting || event.affix.intersectionRatio < 0.5) {
        return true
      }
    }
  } else {
    // 没有参考元素的情况下：【固钉不可视】或者【部分可视】
    if (!event.affix.isIntersecting || event.affix.intersectionRatio < 0.5) {
      return true
    }
  }
  return false
}
const update = () => {
  updateAffixBounding()
  event.affix.needFloat = false
  if (
    event.affix.directions.includes(Direction.Left) ||
    event.affix.directions.includes(Direction.Right) ||
    event.target.directions.includes(Direction.Left) ||
    event.target.directions.includes(Direction.Right)
  ) {
    event.affix.needFloat = false
  } else {
    if (needReCalc()) {
      const nearTop = affixY.value + affixHeight.value / 2 <= window.innerHeight / 2
      event.affix.needFloat = position === Direction.Top ? nearTop : !nearTop
    }
  }
  if (event.affix.needFloat) {
    affixStyle.value = {
      zIndex: 100,
      left: px(affixX.value),
      [position === Direction.Bottom ? "bottom" : "top"]: px(offset),
    }
    affixScale.value = {
      minWidth: px(width.value),
      height: px(height.value),
    }
  } else {
    affixStyle.value = {}
    affixScale.value = {}
  }
}

function init() {
  childEl.value = affixInner.value?.firstElementChild as HTMLElement | null
  targetEl.value = getTargetEl(target)
  onUpdate(update)
}
const throttledUpdate = useThrottleFn(update, 250, true)
onMounted(() => {
  init()
  window.addEventListener("resize", throttledUpdate)
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", throttledUpdate)
})
defineExpose({
  update: () => {
    if (needReCalc()) {
      update()
    }
  },
})
</script>
<template>
  <div class="comp-affix" :class="{ fix: event.affix.needFloat }" :style="affixScale" ref="affix">
    <div
      ref="affixInner"
      :style="[affixStyle, affixScale]"
      class="comp-affix-inner"
      :class="{ fix: event.affix.needFloat }">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.comp-affix {
  --affix-fix-shadow: var(--el-box-shadow);
  --affix-fix-bg-color: var(--el-card-bg-color);
  .comp-affix-inner {
    transition: box-shadow 0.3s;
    border-radius: 1rem;
    &.fix {
      position: fixed;
      box-shadow: var(--affix-fix-shadow);
      background-color: var(--affix-fix-bg-color);
    }
  }
}
</style>
