import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export default {
  label: "el-input-number",
  desc: "element-plus@el-input-number",
  props: {
    "model-value": {
      type: PropsType.Number,
      desc: "选中项绑定值",
      allowEmpty: true,
    },
    min: {
      type: PropsType.Number,
      desc: "设置计数器允许的最小值",
      default: -Infinity,
    },
    max: {
      type: PropsType.Number,
      desc: "设置计数器允许的最大值",
      default: Infinity,
    },
    step: {
      type: PropsType.Number,
      desc: "计数器步长",
      default: 1,
    },
    "step-strictly": {
      type: PropsType.Boolean,
      desc: "是否只能输入 step 的倍数",
      default: false,
    },
    precision: {
      type: PropsType.Number,
      desc: "数值精度",
      allowEmpty: true,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "计数器尺寸",
      default: "default",
    },
    readonly: {
      type: PropsType.Boolean,
      desc: "原生 readonly 属性，是否只读",
      default: false,
      version: "2.2.16",
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用状态",
      default: false,
    },
    controls: {
      type: PropsType.Boolean,
      desc: "是否使用控制按钮",
      default: true,
    },
    "controls-position": {
      type: PropsType.Enum,
      enums: ["right", "none"],
      desc: "控制按钮位置",
      allowEmpty: true,
    },
    name: {
      type: PropsType.String,
      desc: "等价于原生 input name 属性",
      allowEmpty: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "等价于原生 input aria-label 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    placeholder: {
      type: PropsType.String,
      desc: "等价于原生 input placeholder 属性",
      allowEmpty: true,
    },
    id: {
      type: PropsType.String,
      desc: "等价于原生 input id 属性",
      allowEmpty: true,
    },
    "value-on-clear": {
      type: [PropsType.Number, PropsType.Null, PropsType.Enum],
      desc: "当输入框被清空时显示的值",
      allowEmpty: true,
      version: "2.2.0",
      finalType: PropsType.Number,
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "是否触发表单验证",
      default: true,
    },
  },
  slots: {
    "decrease-icon": {
      label: ComponentLabel.NULL,
      desc: "自定义输入框按钮减少图标",
      props: {},
      version: "2.6.3",
    },
    "increase-icon": {
      label: ComponentLabel.NULL,
      desc: "自定义输入框按钮增加图标",
      props: {},
      version: "2.6.3",
    },
    prefix: {
      label: ComponentLabel.NULL,
      desc: "输入框头部内容",
      props: {},
      version: "2.8.4",
    },
    suffix: {
      label: ComponentLabel.NULL,
      desc: "输入框尾部内容",
      props: {},
      version: "2.8.4",
    },
  },
  events: {
    change: {
      name: "change",
      desc: "绑定值被改变时触发",
      args: ["currentValue", "oldValue"],
    },
    blur: {
      name: "blur",
      desc: "在组件 Input 失去焦点时触发",
      args: ["event"],
    },
    focus: {
      name: "focus",
      desc: "在组件 Input 获得焦点时触发",
      args: ["event"],
    },
  },
} as RawComponent
