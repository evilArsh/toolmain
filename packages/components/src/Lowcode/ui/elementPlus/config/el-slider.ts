import { PropsType, RawComponent } from "../../../types"
export default {
  label: "el-slider",
  desc: "element-plus@el-slider",
  props: {
    "model-value": {
      type: [PropsType.Number, PropsType.JSON],
      desc: "选中项绑定值",
      finalType: PropsType.Number,
      default: 0,
    },
    min: {
      type: PropsType.Number,
      desc: "最小值",
      default: 0,
    },
    max: {
      type: PropsType.Number,
      desc: "最大值",
      default: 100,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    step: {
      type: PropsType.Number,
      desc: "步长",
      default: 1,
    },
    "show-input": {
      type: PropsType.Boolean,
      desc: "是否显示输入框，仅在非范围选择时有效",
      default: false,
    },
    "show-input-controls": {
      type: PropsType.Boolean,
      desc: "在显示输入框的情况下，是否显示输入框的控制按钮",
      default: true,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "slider 包装器的大小，垂直模式下该属性不可用",
      default: "default",
    },
    "input-size": {
      type: PropsType.Enum,
      enums: ["large", "default", "small", ""],
      desc: "输入框的大小，如果设置了 size 属性，默认值自动取 size",
      default: "default",
    },
    "show-stops": {
      type: PropsType.Boolean,
      desc: "是否显示间断点",
      default: false,
    },
    "show-tooltip": {
      type: PropsType.Boolean,
      desc: "是否显示提示信息",
      default: true,
    },
    "format-tooltip": {
      type: PropsType.Function,
      desc: "格式化提示信息",
      allowEmpty: true,
      args: ["value"],
      returnType: "string|number",
    },
    range: {
      type: PropsType.Boolean,
      desc: "是否开启选择范围",
      default: false,
    },
    vertical: {
      type: PropsType.Boolean,
      desc: "垂直模式",
      default: false,
    },
    height: {
      type: PropsType.String,
      desc: "滑块高度，垂直模式必填",
      allowEmpty: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "原生 aria-label属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    "range-start-label": {
      type: PropsType.String,
      desc: "当 range 为true时，屏幕阅读器标签开始的标记",
      allowEmpty: true,
    },
    "range-end-label": {
      type: PropsType.String,
      desc: "当 range 为true时，屏幕阅读器标签结尾的标记",
      allowEmpty: true,
    },
    "format-value-text": {
      type: PropsType.Function,
      desc: "显示屏幕阅读器的 aria-valuenow 属性的格式",
      allowEmpty: true,
      args: ["value"],
      returnType: "string",
    },
    debounce: {
      type: PropsType.Number,
      desc: "输入时的去抖延迟，毫秒，仅在 show-input 等于 true 时有效",
      default: 300,
    },
    "tooltip-class": {
      type: PropsType.String,
      desc: "tooltip 的自定义类名",
      allowEmpty: true,
    },
    placement: {
      type: PropsType.Enum,
      enums: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
      desc: "Tooltip 出现的位置",
      default: "top",
    },
    marks: {
      type: PropsType.JSON,
      desc: "标记， key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标记可以单独设置样式",
      allowEmpty: true,
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "输入时是否触发表单的校验",
      default: true,
    },
    persistent: {
      type: PropsType.Boolean,
      desc: "当 slider 的 tooltip 处于非活动状态且 persistent 为 false 时，Popconfirm 将被销毁。当 show-tooltip 为 false 时，persistent 将始终为 false",
      default: true,
      version: "2.9.5",
    },
  },
  events: {
    change: {
      name: "change",
      desc: "值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发）",
      args: ["value"],
      returnType: "boolean",
    },
    input: {
      name: "input",
      desc: "数据改变时触发（使用鼠标拖曳时，活动过程实时触发）",
      args: ["value"],
      returnType: "boolean",
    },
  },
} as RawComponent
