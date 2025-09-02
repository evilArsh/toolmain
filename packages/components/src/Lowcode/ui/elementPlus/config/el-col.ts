import { RawComponent, PropsType, ComponentLabel } from "../../../types"

export const ElCol: RawComponent = {
  label: "el-col",
  desc: "element-plus@el-col",
  props: {
    span: {
      type: PropsType.Number,
      desc: "栅格占据的列数",
      default: 24,
    },
    offset: {
      type: PropsType.Number,
      desc: "栅格左侧的间隔格数",
      default: 0,
    },
    push: {
      type: PropsType.Number,
      desc: "栅格向右移动格数",
      default: 0,
    },
    pull: {
      type: PropsType.Number,
      desc: "栅格向左移动格数",
      default: 0,
    },
    xs: {
      type: [PropsType.Number, PropsType.JSON],
      desc: "`<768px`响应式栅格数或者栅格属性对象",
      finalType: PropsType.Number,
      allowEmpty: true,
    },
    sm: {
      type: [PropsType.Number, PropsType.JSON],
      desc: "`≥768px`响应式栅格数或者栅格属性对象",
      finalType: PropsType.Number,
      allowEmpty: true,
    },
    md: {
      type: [PropsType.Number, PropsType.JSON],
      desc: "`≥992px`响应式栅格数或者栅格属性对象",
      finalType: PropsType.Number,
      allowEmpty: true,
    },
    lg: {
      type: [PropsType.Number, PropsType.JSON],
      desc: "`≥1200px`响应式栅格数或者栅格属性对象",
      finalType: PropsType.Number,
      allowEmpty: true,
    },
    xl: {
      type: [PropsType.Number, PropsType.JSON],
      desc: "`≥1920px`响应式栅格数或者栅格属性对象",
      finalType: PropsType.Number,
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
}
