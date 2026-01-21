import { CallBackFn } from "@toolmain/shared"
import { useElementBounding, useIntersectionObserver } from "@vueuse/core"
import { onBeforeUnmount, reactive, shallowRef, type ShallowRef } from "vue"

export enum Direction {
  Left = "left",
  Right = "right",
  Top = "top",
  Bottom = "bottom",
}
export function getTargetEl(selector?: string): HTMLElement | null {
  if (selector) {
    const tarEl = document.querySelector(selector)
    if (tarEl && tarEl instanceof HTMLElement) {
      return tarEl
    } else {
      console.warn(`[Affix] cannot find target: ${selector}`)
    }
  }
  return null
}
export function useIntersection(affixRef: ShallowRef<HTMLElement | null>, targetEl: ShallowRef<HTMLElement | null>) {
  const threshold = 2
  const obThreshold = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  const {
    x: affixX,
    y: affixY,
    width: affixWidth,
    height: affixHeight,
    update: updateAffixBounding,
  } = useElementBounding(affixRef)
  const updateCallback = shallowRef<CallBackFn>()

  const event = reactive({
    target: {
      isIntersecting: false,
      intersectionRatio: 0.0,
      directions: [] as Direction[],
    },
    affix: {
      isIntersecting: false,
      intersectionRatio: 0.0,
      needFloat: false,
      directions: [] as Direction[],
    },
  })
  function updateIntersectDirection(entry: IntersectionObserverEntry, directions: Direction[]) {
    const { boundingClientRect: target, intersectionRect: inter, rootBounds: root } = entry
    if (!root) {
      console.warn(`[getIntersectDirection] no root bounds`, entry)
      return
    }
    if (entry.isIntersecting) {
      directions.length = 0
      if (inter.y - target.y > threshold) directions.push(Direction.Top)
      if (target.y - inter.y > threshold) directions.push(Direction.Bottom)
      if (inter.x - target.x > threshold) directions.push(Direction.Left)
      if (target.x + target.width - (inter.x + inter.width) > threshold) directions.push(Direction.Right)
    }
  }
  const affixOb = useIntersectionObserver(
    affixRef,
    entry => {
      const lastest = entry.pop()
      // console.log(`[affix]`, lastest)
      if (!lastest) return
      event.affix.isIntersecting = lastest.isIntersecting
      updateIntersectDirection(lastest, event.affix.directions)
      event.affix.intersectionRatio = lastest.intersectionRatio
      updateCallback.value?.()
    },
    {
      root: window.document.documentElement,
      threshold: obThreshold,
    }
  )
  const targetOb = useIntersectionObserver(
    targetEl,
    entry => {
      const lastest = entry.pop()
      // console.log(`[target]`, lastest)
      if (!lastest) return
      event.target.isIntersecting = lastest.isIntersecting
      updateIntersectDirection(lastest, event.target.directions)
      event.target.intersectionRatio = lastest.intersectionRatio
      updateCallback.value?.()
    },
    {
      root: window.document.documentElement,
      threshold: obThreshold,
    }
  )
  function onUpdate(callback: CallBackFn) {
    updateCallback.value = callback
  }

  onBeforeUnmount(() => {
    affixOb.stop()
    targetOb.stop()
  })

  return {
    event,
    affixX,
    affixY,
    affixWidth,
    affixHeight,
    updateAffixBounding,
    onUpdate,
  }
}
