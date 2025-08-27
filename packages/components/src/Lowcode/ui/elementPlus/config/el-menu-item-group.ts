import { ComponentLabel, RawComponent, PropsType } from "../../../types"

export default {
  label: "el-menu-item-group",
  desc: "element-plus@el-menu-item-group",
  props: {
    title: {
      type: PropsType.String,
      desc: "组标题",
      default: "el-menu-item-group标题",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.PLACEHOLDER,
      desc: "占位",
      props: {},
    },
    title: {
      label: ComponentLabel.NULL,
      desc: "自定义标题内容",
      props: {},
    },
  },
} as RawComponent
