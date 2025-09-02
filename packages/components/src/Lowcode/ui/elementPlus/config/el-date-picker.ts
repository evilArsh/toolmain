import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElDatePicker: RawComponent = {
  label: "el-date-picker",
  desc: "element-plus@el-date-picker",
  props: {
    "model-value": {
      type: [PropsType.Number, PropsType.String, PropsType.JSON],
      desc: "绑定值，如果它是数组，长度应该是 2",
      default: "",
      allowEmpty: true,
      finalType: PropsType.String,
    },
    readonly: {
      type: PropsType.Boolean,
      desc: "只读",
      default: false,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "禁用",
      default: false,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "输入框尺寸",
      allowEmpty: true,
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
    type: {
      type: PropsType.Enum,
      enums: [
        "year",
        "years",
        "month",
        "months",
        "date",
        "dates",
        "datetime",
        "week",
        "datetimerange",
        "daterange",
        "monthrange",
        "yearrange",
      ],
      desc: "显示类型",
      default: "date",
    },
    format: {
      type: PropsType.String,
      desc: "显示在输入框中的格式",
      default: "YYYY-MM-DD",
      allowEmpty: true,
    },
    "popper-class": {
      type: PropsType.String,
      desc: "DatePicker 下拉框的类名",
      allowEmpty: true,
    },
    "popper-options": {
      type: PropsType.JSON,
      desc: "自定义 popper 选项，更多请参考 popper.js",
      default: JSON.stringify({}),
    },
    "range-separator": {
      type: PropsType.String,
      desc: "选择范围时的分隔符",
      default: "-",
    },
    "default-value": {
      type: PropsType.JSON,
      desc: "可选，选择器打开时默认显示的时间",
      allowEmpty: true,
    },
    "default-time": {
      type: PropsType.JSON,
      desc: "范围选择时选中日期所使用的当日内具体时刻",
      allowEmpty: true,
    },
    "value-format": {
      type: PropsType.String,
      desc: "可选，绑定值的格式。不指定则绑定值为 Date 对象",
      allowEmpty: true,
    },
    "unlink-panels": {
      type: PropsType.Boolean,
      desc: "在范围选择器里取消两个日期面板之间的联动",
      default: false,
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
    "validate-event": {
      type: PropsType.Boolean,
      desc: "是否触发表单验证",
      default: true,
    },
    "disabled-date": {
      type: PropsType.Function,
      desc: "一个用来判断该日期是否被禁用的函数，接受一个 Date 对象作为参数。 应该返回一个 Boolean 值",
      allowEmpty: true,
      args: ["date"],
      returnType: "boolean",
    },
    "cell-class-name": {
      type: PropsType.Function,
      desc: "设置自定义类名",
      allowEmpty: true,
      args: ["date"],
      returnType: "string",
    },
    teleported: {
      type: PropsType.Boolean,
      desc: "是否将 popover 的下拉列表渲染至 body 下",
      default: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "等价于原生 input aria-label 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    id: {
      type: PropsType.JSON,
      desc: "等价于原生 input id 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    name: {
      type: PropsType.JSON,
      desc: "等价于原生 input name 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    "popper-effect": {
      type: [PropsType.Enum, PropsType.String],
      enums: ["dark", "light"],
      desc: "DatePicker 下拉框的弹出效果",
      default: "light",
      finalType: PropsType.Enum,
    },
    shortcuts: {
      type: PropsType.JSON,
      desc: "设置快捷选项，需要传入数组对象",
      allowEmpty: true,
    },
    "arrow-control": {
      type: PropsType.Boolean,
      desc: "是否使用箭头进行选择，仅在 type 为 'date' 时生效",
      default: false,
    },
    label: {
      type: PropsType.String,
      desc: "等价于原生 input aria-label 属性",
      allowEmpty: true,
      version: "2.8.5",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义内容",
      props: {},
    },
    "range-separator": {
      label: ComponentLabel.NULL,
      desc: "自定义分隔符",
      props: {},
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
      desc: "当选择器的输入框失去焦点时触发",
      args: ["event"],
    },
    focus: {
      name: "focus",
      desc: "当选择器的输入框获得焦点时触发",
      args: ["event"],
    },
    calendar: {
      name: "calendar",
      desc: "在日历所表示的日期更改时触发。仅在 type 为 'week' 时生效",
      args: ["value"],
      version: "2.8.5",
    },
    "panel-change": {
      name: "panel-change",
      desc: "当日期面板改变时触发",
      args: ["value", "mode", "view"],
      version: "2.8.5",
    },
    "visible-change": {
      name: "visible-change",
      desc: "当 DatePicker 的下拉列表出现/消失时触发",
      args: ["visibility"],
    },
  },
}
