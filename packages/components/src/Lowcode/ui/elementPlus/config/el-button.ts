import { ComponentLabel, PropsType, RawComponent } from "../../../types"
import { EpComponentFlag } from "../componentParser"

export default {
  label: "el-button",
  desc: "element-plus@el-button",
  props: {
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "尺寸",
      allowEmpty: true,
    },
    type: {
      type: PropsType.Enum,
      enums: ["primary", "success", "warning", "danger", "info"],
      desc: "类型",
      allowEmpty: true,
    },
    plain: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否为朴素按钮",
    },
    text: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否为文字按钮",
      version: "2.2.0",
    },
    bg: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否显示文字按钮背景颜色",
      version: "2.2.0",
    },
    link: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否为链接按钮",
      version: "2.2.1",
    },
    round: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否为圆角按钮",
    },
    circle: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否为圆形按钮",
    },
    loading: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否为加载中状态",
    },
    "loading-icon": {
      type: PropsType.Extend,
      extendType: EpComponentFlag,
      desc: "自定义加载中状态图标组件",
    },
    disabled: {
      type: PropsType.Boolean,
      default: false,
      desc: "按钮是否为禁用状态",
    },
    icon: {
      type: PropsType.Icon,
      allowEmpty: true,
      desc: "图标组件",
    },
    autofocus: {
      type: PropsType.Boolean,
      default: false,
      desc: "原生`autofocus`属性",
    },
    "native-type": {
      type: PropsType.Enum,
      default: "button",
      desc: "原生`type`属性",
      enums: ["button", "submit", "reset"],
    },
    "auto-insert-space": {
      type: PropsType.Boolean,
      desc: "自动在两个中文字符之间插入空格",
      allowEmpty: true,
    },
    color: {
      type: PropsType.Color,
      desc: "自定义按钮颜色, 并自动计算`hover`和`active`触发后的颜色",
      allowEmpty: true,
    },
    dark: {
      type: PropsType.Boolean,
      default: false,
      desc: "`dark`模式, 意味着自动设置`color`为`dark`模式的颜色",
    },
    tag: {
      type: PropsType.String,
      default: "button",
      desc: "自定义元素标签",
      version: "2.3.4",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "按钮默认插槽内容",
      props: {},
    },
    loading: {
      label: ComponentLabel.NULL,
      desc: "loading插槽",
      props: {},
    },
    icon: {
      label: ComponentLabel.NULL,
      desc: "icon插槽",
      props: {},
    },
  },
} as RawComponent
