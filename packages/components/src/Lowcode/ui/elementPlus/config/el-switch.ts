import { ComponentLabel, PropsType, RawComponent } from "../../../types"
export default {
  label: "el-switch",
  desc: "element-plus@el-switch",
  props: {
    "model-value": {
      type: [PropsType.Boolean, PropsType.String, PropsType.Number],
      desc: "绑定值，必须等于 active-value 或 inactive-value，默认为 Boolean 类型",
      default: false,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    loading: {
      type: PropsType.Boolean,
      desc: "是否显示加载中",
      default: false,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "switch 的大小",
      default: "",
    },
    width: {
      type: [PropsType.Number, PropsType.String],
      desc: "switch 的宽度",
      default: "",
    },
    "inline-prompt": {
      type: PropsType.Boolean,
      desc: "无论图标或文本是否显示在点内，只会呈现文本的第一个字符",
      default: false,
    },
    "active-icon": {
      type: PropsType.Icon,
      desc: "switch 状态为 on 时所显示图标，设置此项会忽略 active-text",
      allowEmpty: true,
    },
    "inactive-icon": {
      type: PropsType.Icon,
      desc: "switch 状态为 off 时所显示图标，设置此项会忽略 inactive-text",
      allowEmpty: true,
    },
    "active-action-icon": {
      type: PropsType.Icon,
      desc: "on 状态下显示的图标组件",
      allowEmpty: true,
      version: "2.3.9",
    },
    "inactive-action-icon": {
      type: PropsType.Icon,
      desc: "off 状态下显示的图标组件",
      allowEmpty: true,
      version: "2.3.9",
    },
    "active-text": {
      type: PropsType.String,
      desc: "switch 打开时的文字描述",
      default: "",
    },
    "inactive-text": {
      type: PropsType.String,
      desc: "switch 的状态为 off 时的文字描述",
      default: "",
    },
    "active-value": {
      type: [PropsType.Boolean, PropsType.String, PropsType.Number],
      desc: "switch 状态为 on 时的值",
      default: true,
    },
    "inactive-value": {
      type: [PropsType.Boolean, PropsType.String, PropsType.Number],
      desc: "switch 的状态为 off 时的值",
      default: false,
    },
    name: {
      type: PropsType.String,
      desc: "switch 对应的 name 属性",
      default: "",
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "是否触发表单验证",
      default: true,
    },
    "before-change": {
      type: [PropsType.Boolean, PropsType.Function],
      desc: "switch 状态改变前的钩子，返回 false 或者返回 Promise 且被 reject 则停止切换",
      allowEmpty: true,
      args: [],
      returnType: "Promise<boolean>",
    },
    id: {
      type: PropsType.String,
      desc: "input 的 id",
      allowEmpty: true,
    },
    tabindex: {
      type: [PropsType.String, PropsType.Number],
      desc: "input 的 tabindex",
      allowEmpty: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "等价于原生 input aria-label 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
  },
  events: {
    change: {
      name: "change",
      desc: "switch 状态发生变化时的回调函数",
      args: ["value"],
    },
  },
  slots: {
    "active-action": {
      label: ComponentLabel.NULL,
      desc: "自定义 active 行为",
      props: {},
      version: "2.4.4",
    },
    "inactive-action": {
      label: ComponentLabel.NULL,
      desc: "自定义 inactive 行为",
      props: {},
      version: "2.4.4",
    },
  },
} as RawComponent
