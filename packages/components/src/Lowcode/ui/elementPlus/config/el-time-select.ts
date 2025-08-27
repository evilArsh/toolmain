import { PropsType, RawComponent } from "../../../types"
export default {
  label: "el-time-select",
  desc: "element-plus@el-time-select",
  props: {
    "model-value": {
      type: PropsType.String,
      desc: "选中项绑定值",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "禁用状态",
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
    "include-end-time": {
      type: PropsType.Boolean,
      desc: "是否在选项中包含end",
      default: false,
      version: "2.9.3",
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "输入框尺寸",
      default: "default",
    },
    placeholder: {
      type: PropsType.String,
      desc: "非范围选择时的占位内容",
      allowEmpty: true,
    },
    name: {
      type: PropsType.String,
      desc: "原生属性",
      allowEmpty: true,
    },
    effect: {
      type: [PropsType.String, PropsType.Enum],
      desc: "Tooltip 主题，内置了 dark / light 两种主题",
      default: "light",
      enums: ["dark", "light"],
      finalType: PropsType.Enum,
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
    start: {
      type: PropsType.String,
      desc: "开始时间",
      default: "09:00",
    },
    end: {
      type: PropsType.String,
      desc: "结束时间",
      default: "18:00",
    },
    step: {
      type: PropsType.String,
      desc: "间隔时间",
      default: "00:30",
    },
    "min-time": {
      type: PropsType.String,
      desc: "最早时间点，早于该时间的时间段将被禁用",
      allowEmpty: true,
    },
    "max-time": {
      type: PropsType.String,
      desc: "最晚时间点，晚于该时间的时间段将被禁用",
      allowEmpty: true,
    },
    format: {
      type: PropsType.String,
      desc: "设置时间格式",
      allowEmpty: true,
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
      desc: "可清空的单选模式下用户点击清空按钮时触发",
      args: [],
      version: "2.7.7",
    },
  },
} as RawComponent
