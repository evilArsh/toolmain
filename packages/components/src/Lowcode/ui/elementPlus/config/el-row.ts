import { RawComponent, PropsType, ComponentLabel } from "../../../types"

export default {
  label: "el-row",
  desc: "element-plus@el-row",
  props: {
    gutter: {
      type: PropsType.Number,
      desc: "栅格间隔",
      default: 0,
    },
    justify: {
      type: PropsType.Enum,
      desc: "flex 布局下的水平排列方式",
      enums: ["start", "end", "center", "space-around", "space-between", "space-evenly"],
      default: "start",
    },
    align: {
      type: PropsType.Enum,
      desc: "flex 布局下的垂直排列方式",
      enums: ["top", "middle", "bottom"],
      allowEmpty: true,
    },
    tag: {
      type: PropsType.String,
      desc: "自定义元素标签",
      default: "div",
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
