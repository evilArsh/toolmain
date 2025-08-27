import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export default {
  label: "el-form",
  desc: "element-plus@el-form",
  props: {
    model: {
      type: PropsType.JSON,
      desc: "表单数据对象",
      allowEmpty: true,
    },
    rules: {
      type: PropsType.JSON,
      desc: "表单验证规则",
      allowEmpty: true,
    },
    inline: {
      type: PropsType.Boolean,
      desc: "行内表单模式",
      default: false,
    },
    "label-position": {
      type: PropsType.Enum,
      enums: ["left", "right", "top"],
      desc: "表单域标签的位置，当设置为 left 或 right 时，则也需要设置 label-width 属性",
      default: "right",
    },
    "label-width": {
      type: [PropsType.String, PropsType.Number],
      desc: "标签的长度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。可以使用 auto。",
      default: "",
      allowEmpty: true,
      finalType: PropsType.String,
    },
    "label-suffix": {
      type: PropsType.String,
      desc: "表单域标签的后缀",
      default: "",
    },
    "hide-required-asterisk": {
      type: PropsType.Boolean,
      desc: "是否隐藏必填字段标签旁边的红色星号。",
      default: false,
    },
    "require-asterisk-position": {
      type: PropsType.Enum,
      enums: ["left", "right"],
      desc: "星号的位置。",
      default: "left",
    },
    "show-message": {
      type: PropsType.Boolean,
      desc: "是否显示校验错误信息",
      default: true,
    },
    "inline-message": {
      type: PropsType.Boolean,
      desc: "是否以行内形式展示校验信息",
      default: false,
    },
    "status-icon": {
      type: PropsType.Boolean,
      desc: "是否在输入框中显示校验结果反馈图标",
      default: false,
    },
    "validate-on-rule-change": {
      type: PropsType.Boolean,
      desc: "是否在 rules 属性改变后立即触发一次验证",
      default: true,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "用于控制该表单内组件的尺寸",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用该表单内的所有组件。如果设置为 true, 它将覆盖内部组件的 disabled 属性",
      default: false,
    },
    "scroll-to-error": {
      type: PropsType.Boolean,
      desc: "当校验失败时，滚动到第一个错误表单项",
      default: false,
    },
    "scroll-into-view-options": {
      type: [PropsType.JSON, PropsType.Boolean],
      desc: "当校验有失败结果时，滚动到第一个失败的表单项目 可通过 scrollIntoView 配置",
      allowEmpty: true,
      version: "2.3.2",
      finalType: PropsType.Boolean,
    },
  },
  events: {
    validate: {
      name: "validate",
      desc: "任一表单项被校验后触发",
      args: ["prop", "isValid", "message"],
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
