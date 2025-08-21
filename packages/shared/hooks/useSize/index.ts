import { toNumber } from "@toolmain/shared"
import { App } from "vue"

export type SizeConfig = {
  pcBaseWidth: number
  minFontSize: number
  maxFontSize: number
}
export function useHtmlFontSize(app: App<Element>, preset?: SizeConfig) {
  const setRootFontSize = () => {
    const w = window.innerWidth
    let fontSize: number
    const pcBaseWidth = toNumber(preset?.pcBaseWidth ?? 2560)
    const minFontSize = toNumber(preset?.minFontSize ?? 10)
    const maxFontSize = toNumber(preset?.maxFontSize ?? 10)
    if (w <= 750) {
      fontSize = minFontSize
    } else if (w > 750 && w <= pcBaseWidth) {
      // TODO
      fontSize = minFontSize
    } else {
      const scale = w / pcBaseWidth
      fontSize = scale * minFontSize
      fontSize = Math.max(minFontSize, Math.min(fontSize, maxFontSize))
    }
    document.documentElement.style.fontSize = `${fontSize}px`
  }
  setRootFontSize()
  window.addEventListener("resize", setRootFontSize)
  app.onUnmount(() => {
    window.removeEventListener("resize", setRootFontSize)
  })
}
