import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElInputTag: RawComponent = {
  label: "el-input-tag",
  desc: "element-plus@el-input-tag",
  props: {
    "model-value": {
      type: PropsType.JSON,
      desc: "绑定值",
      allowEmpty: true,
    },
    max: {
      type: PropsType.Number,
      desc: "可添加标签的最大数量",
      allowEmpty: true,
    },
    "tag-type": {
      type: PropsType.Enum,
      enums: ["success", "info", "warning", "danger"],
      desc: "标签类型",
      default: "info",
    },
    "tag-effect": {
      type: PropsType.Enum,
      enums: ["dark", "light", "plain"],
      desc: "标签效果",
      default: "light",
    },
    trigger: {
      type: PropsType.Enum,
      enums: ["Enter", "Space", "Tab", "Comma"],
      desc: "触发输入标签的按键",
      default: "Enter",
    },
    draggable: {
      type: PropsType.Boolean,
      desc: "是否可以拖动标签",
      default: false,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "输入框尺寸",
      allowEmpty: true,
    },
    clearable: {
      type: PropsType.Boolean,
      desc: "是否显示清除按钮",
      default: false,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "是否触发表单验证",
      default: true,
    },
    readonly: {
      type: PropsType.Boolean,
      desc: "等价于原生 readonly 属性",
      default: false,
    },
    autofocus: {
      type: PropsType.Boolean,
      desc: "等价于原生 autofocus 属性",
      default: false,
    },
    id: {
      type: PropsType.String,
      desc: "等价于原生 input id 属性",
      allowEmpty: true,
    },
    tabindex: {
      type: [PropsType.String, PropsType.Number],
      desc: "等价于原生 tabindex 属性",
      allowEmpty: true,
      finalType: PropsType.Number,
    },
    maxlength: {
      type: [PropsType.String, PropsType.Number],
      desc: "等价于原生 maxlength 属性",
      allowEmpty: true,
      finalType: PropsType.Number,
    },
    minlength: {
      type: [PropsType.String, PropsType.Number],
      desc: "等价于原生 minlength 属性",
      allowEmpty: true,
      finalType: PropsType.Number,
    },
    placeholder: {
      type: PropsType.String,
      desc: "输入框占位文本",
      allowEmpty: true,
    },
    autocomplete: {
      type: PropsType.String,
      desc: "等价于原生 autocomplete 属性",
      default: "off",
    },
    "aria-label": {
      type: PropsType.String,
      desc: "等价于原生 aria-label 属性",
      allowEmpty: true,
    },
  },
  events: {
    change: {
      name: "change",
      desc: "绑定值变化时触发的事件",
      args: ["value"],
    },
    input: {
      name: "input",
      desc: "在 Input 值改变时触发",
      args: ["value"],
    },
    "add-tag": {
      name: "add-tag",
      desc: "tag 被添加时触发",
      args: ["tag"],
    },
    "remove-tag": {
      name: "remove-tag",
      desc: "tag 被移除时触发",
      args: ["tag"],
    },
    focus: {
      name: "focus",
      desc: "在 Input 获得焦点时触发",
      args: ["event"],
    },
    blur: {
      name: "blur",
      desc: "在 Input 失去焦点时触发",
      args: ["event"],
    },
    clear: {
      name: "clear",
      desc: "点击清除图标时触发",
      args: [],
    },
  },
  slots: {
    tag: {
      label: ComponentLabel.NULL,
      desc: "作为 tag 的内容",
      props: {},
    },
    prefix: {
      label: ComponentLabel.NULL,
      desc: "InputTag 头部内容",
      props: {},
    },
    suffix: {
      label: ComponentLabel.NULL,
      desc: "InputTag 尾部内容",
      props: {},
    },
  },
}
