import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export default {
  label: "el-autocomplete",
  desc: "element-plus@el-autocomplete",
  props: {
    "model-value": {
      type: PropsType.String,
      desc: "选中项绑定值",
      allowEmpty: true,
    },
    placeholder: {
      type: PropsType.String,
      desc: "占位文本",
      allowEmpty: true,
    },
    clearable: {
      type: PropsType.Boolean,
      desc: "是否可清空",
      default: false,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "自动补全组件是否被禁用",
      default: false,
    },
    "value-key": {
      type: PropsType.String,
      desc: "输入建议对象中用于显示的键名",
      default: "value",
    },
    debounce: {
      type: PropsType.Number,
      desc: "获取输入建议的防抖延时，单位为毫秒",
      default: 300,
    },
    placement: {
      type: PropsType.Enum,
      enums: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"],
      desc: "菜单弹出位置",
      default: "bottom-start",
    },
    "fetch-suggestions": {
      type: [PropsType.JSON, PropsType.Function],
      desc: "获取输入建议的方法，仅当你的输入建议数据 resolve 时，通过调用 callback(data:[]) 来返回它",
      allowEmpty: true,
      finalType: PropsType.JSON,
      default: JSON.stringify([{ value: "默认文本" }]),
    },
    "trigger-on-focus": {
      type: PropsType.Boolean,
      desc: "是否在输入框聚焦时显示建议",
      default: true,
    },
    "select-when-unmatched": {
      type: PropsType.Boolean,
      desc: "在输入没有任何匹配建议的情况下，按下回车是否触发 select 事件",
      default: false,
    },
    name: {
      type: PropsType.String,
      desc: "等价于原生 input name 属性",
      allowEmpty: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "原生 aria-label 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    "hide-loading": {
      type: PropsType.Boolean,
      desc: "是否隐藏远程加载时的加载图标",
      default: false,
    },
    "popper-class": {
      type: PropsType.String,
      desc: "下拉列表的类名",
      allowEmpty: true,
    },
    teleported: {
      type: PropsType.Boolean,
      desc: "是否将下拉列表元素插入 append-to 指向的元素下",
      default: true,
    },
    "highlight-first-item": {
      type: PropsType.Boolean,
      desc: "是否默认高亮远程搜索结果的第一项",
      default: false,
    },
    "fit-input-width": {
      type: PropsType.Boolean,
      desc: "下拉框的宽度是否与输入框相同",
      default: false,
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义输入建议的内容",
      props: {},
    },
    prefix: {
      label: ComponentLabel.NULL,
      desc: "输入框头部内容",
      props: {},
    },
    suffix: {
      label: ComponentLabel.NULL,
      desc: "输入框尾部内容",
      props: {},
    },
    prepend: {
      label: ComponentLabel.NULL,
      desc: "输入框前置内容，在 prefix 之前",
      props: {},
    },
    append: {
      label: ComponentLabel.NULL,
      desc: "输入框后置内容，在 suffix 之后",
      props: {},
    },
    loading: {
      label: ComponentLabel.NULL,
      desc: "修改加载区域内容",
      props: {},
      version: "2.5.0",
    },
  },
  events: {
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
    input: {
      name: "input",
      desc: "在 Input 值改变时触发",
      args: ["value"],
    },
    clear: {
      name: "clear",
      desc: "在点击由 clearable 属性生成的清空按钮时触发",
      args: [],
    },
    select: {
      name: "select",
      desc: "点击选中建议项时触发",
      args: ["item"],
    },
    change: {
      name: "change",
      desc: "在 Input 值改变时触发",
      args: ["value"],
    },
  },
} as RawComponent
