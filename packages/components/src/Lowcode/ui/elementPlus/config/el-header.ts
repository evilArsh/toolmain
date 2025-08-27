import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export default {
  label: "el-header",
  desc: "element-plus@el-header",
  props: {
    height: {
      type: PropsType.String,
      desc: "顶栏高度",
      default: "60px",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.PLACEHOLDER,
      desc: "占位",
      props: {},
    },
  },
} as RawComponent
