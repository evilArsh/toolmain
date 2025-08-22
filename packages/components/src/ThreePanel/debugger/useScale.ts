import { ScaleConfig } from "@toolmain/components"
import { Ref, ref } from "vue"

export function useScale(): { conf: Ref<ScaleConfig> } {
  const conf = ref<ScaleConfig>({
    containerStyle: {
      left: window.innerWidth - 800,
      top: 10,
      opacity: 0.9,
      zIndex: 200,
    },
    contentStyle: {
      width: 800,
      height: window.innerHeight - 50,
      overflow: "auto",
      border: "solid 1px #3c3c3c",
      // backgroundColor: "#ffffff",
    },
    headerStyle: {
      height: 35,
      color: "#ffffff",
    },
    visible: false,
    autoStick: true,
    moveConfig: {},
    movable: true,
    normal: false,
    scalable: true,
  })
  return {
    conf,
  }
}
