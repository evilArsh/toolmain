import { ScaleConfig } from "@toolmain/components"
import { Ref, ref } from "vue"

export function useScale(): { conf: Ref<ScaleConfig> } {
  const conf = ref<ScaleConfig>({
    containerStyle: {
      left: 0,
      top: 0,
      opacity: 0.9,
      zIndex: 200,
      position: "fixed",
      width: 800,
      height: window.innerHeight - 50,
      boxShadow: "var(--el-box-shadow)",
      backgroundColor: "#ffffff",
      borderRadius: "5px",
    },
    contentStyle: {},
    headerStyle: {
      padding: "10px",
      flexDirection: "column",
      cursor: "move",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px 5px 0 0",
    },
    header: true,
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
