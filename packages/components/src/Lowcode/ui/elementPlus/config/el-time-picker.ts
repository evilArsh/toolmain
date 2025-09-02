import { PropsType, RawComponent } from "../../../types"
export const ElTimePickerComponent: RawComponent = {
  label: "el-time-picker",
  desc: "element-plus@el-time-picker",
  props: {
    "model-value": {
      type: [PropsType.Number, PropsType.String, PropsType.JSON],
      desc: "绑定值，如果它是数组，长度应该是 2",
      default: "",
      finalType: PropsType.String,
    },
    readonly: {
      type: PropsType.Boolean,
      desc: "完全只读",
      default: false,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "禁用",
      default: false,
    },
    editable: {
      type: PropsType.Boolean,
      desc: "文本框可输入",
      default: true,
    },
    clearable: {
      type: PropsType.Boolean,
      desc: "是否显示清除按钮",
      default: true,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "输入框尺寸",
      allowEmpty: true,
    },
    placeholder: {
      type: PropsType.String,
      desc: "非范围选择时的占位内容",
      default: "",
    },
    "start-placeholder": {
      type: PropsType.String,
      desc: "范围选择时开始日期的占位内容",
      allowEmpty: true,
    },
    "end-placeholder": {
      type: PropsType.String,
      desc: "范围选择时结束日期的占位内容",
      allowEmpty: true,
    },
    "is-range": {
      type: PropsType.Boolean,
      desc: "是否为时间范围选择",
      default: false,
    },
    "arrow-control": {
      type: PropsType.Boolean,
      desc: "是否使用箭头进行时间选择",
      default: false,
    },
    "popper-class": {
      type: PropsType.String,
      desc: "TimePicker 下拉框的类名",
      default: "",
    },
    "range-separator": {
      type: PropsType.String,
      desc: "选择范围时的分隔符",
      default: "-",
    },
    format: {
      type: PropsType.String,
      desc: "显示在输入框中的格式",
      allowEmpty: true,
    },
    // TODO: Time
    "default-value": {
      type: PropsType.Time,
      desc: "可选，选择器打开时默认显示的时间",
      allowEmpty: true,
    },
    "value-format": {
      type: PropsType.String,
      desc: "可选，绑定值的格式。不指定则绑定值为 Date 对象",
      allowEmpty: true,
    },
    id: {
      type: [PropsType.String, PropsType.JSON],
      desc: "等价于原生 input id 属性",
      allowEmpty: true,
      finalType: PropsType.String,
    },
    name: {
      type: PropsType.String,
      desc: "等价于原生 input name 属性",
      default: "",
    },
    "aria-label": {
      type: PropsType.String,
      desc: "等价于原生 input aria-label 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    "prefix-icon": {
      type: PropsType.Icon,
      desc: "自定义前缀图标",
      allowEmpty: true,
    },
    "clear-icon": {
      type: PropsType.Icon,
      desc: "自定义清除图标",
      allowEmpty: true,
    },
    "disabled-hours": {
      type: PropsType.Function,
      desc: "禁止选择部分小时选项",
      allowEmpty: true,
      args: ["role", "comparingDate"],
      returnType: "number[]",
    },
    "disabled-minutes": {
      type: PropsType.Function,
      desc: "禁止选择部分分钟选项",
      allowEmpty: true,
      args: ["hour", "role", "comparingDate"],
      returnType: "number[]",
    },
    "disabled-seconds": {
      type: PropsType.Function,
      desc: "禁止选择部分秒选项",
      allowEmpty: true,
      args: ["hour", "minute", "role", "comparingDate"],
      returnType: "number[]",
    },
    teleported: {
      type: PropsType.Boolean,
      desc: "是否将 popover 的下拉列表镜像至 body 元素",
      default: true,
    },
    tabindex: {
      type: [PropsType.String, PropsType.Number],
      desc: "输入框的 tabindex",
      default: 0,
      finalType: PropsType.Number,
    },
    "empty-values": {
      type: PropsType.JSON,
      desc: "组件的空值配置 参考config-provider",
      allowEmpty: true,
      version: "2.7.0",
    },
    "value-on-clear": {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean, PropsType.Function],
      desc: "清空选项的值 参考 config-provider",
      allowEmpty: true,
      version: "2.7.0",
      finalType: PropsType.String,
    },
  },
  events: {
    change: {
      name: "change",
      desc: "用户确认选定的值时触发",
      args: ["value"],
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
    clear: {
      name: "clear",
      desc: "可清空的模式下用户点击清空按钮时触发",
      args: [],
      version: "2.7.7",
    },
    "visible-change": {
      name: "visible-change",
      desc: "当 TimePicker 的下拉列表出现/消失时触发",
      args: ["visible"],
    },
  },
}
