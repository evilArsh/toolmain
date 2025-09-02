import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElContainer: RawComponent = {
  label: "el-container",
  desc: "element-plus@el-container",
  props: {
    direction: {
      type: PropsType.Enum,
      enums: ["horizontal", "vertical"],
      desc: "子元素的排列方向.默认值：子元素中有`el-header`或`el-footer`时为`vertical，否则为`horizontal`",
      default: undefined,
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
