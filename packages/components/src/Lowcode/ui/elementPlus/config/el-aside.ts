import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElAside: RawComponent = {
  label: "el-aside",
  desc: "element-plus@el-aside",
  props: {
    width: {
      type: PropsType.String,
      desc: "侧边栏宽度",
      default: "300px",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.PLACEHOLDER,
      desc: "占位",
      props: {},
    },
  },
}
