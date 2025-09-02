import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElCascader: RawComponent = {
  label: "el-cascader",
  desc: "element-plus@el-cascader",
  props: {
    "model-value": {
      type: [PropsType.String, PropsType.Number, PropsType.JSON],
      desc: "选中项绑定值",
      allowEmpty: true,
    },
    options: {
      type: PropsType.JSON,
      desc: "选项的数据源，value 和 label 可以通过 CascaderProps 自定义",
      allowEmpty: true,
    },
    props: {
      type: PropsType.JSON,
      desc: "配置选项, 请参阅下面 CascaderProps 表",
      allowEmpty: true,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "尺寸",
      allowEmpty: true,
    },
    placeholder: {
      type: PropsType.String,
      desc: "输入框占位文本",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      allowEmpty: true,
    },
    clearable: {
      type: PropsType.Boolean,
      desc: "是否支持清空选项",
      allowEmpty: true,
    },
    "show-all-levels": {
      type: PropsType.Boolean,
      desc: "输入框中是否显示选中值的完整路径",
      default: true,
    },
    "collapse-tags": {
      type: PropsType.Boolean,
      desc: "多选模式下是否折叠Tag",
      allowEmpty: true,
    },
    "collapse-tags-tooltip": {
      type: PropsType.Boolean,
      desc: "当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。要使用此属性，collapse-tags属性必须设定为 true",
      default: false,
    },
    separator: {
      type: PropsType.String,
      desc: "用于分隔选项的字符",
      default: " / ",
    },
    filterable: {
      type: PropsType.Boolean,
      desc: "该选项是否可以被搜索",
      allowEmpty: true,
    },
    "filter-method": {
      type: PropsType.Function,
      desc: "自定义搜索逻辑，第一个参数是node，第二个参数是keyword，返回的布尔值表示是否保留该选项",
      allowEmpty: true,
      args: ["node", "keyword"],
      returnType: "boolean",
    },
    debounce: {
      type: PropsType.Number,
      desc: "搜索关键词正在输入时的去抖延迟，单位为毫秒",
      default: 300,
    },
    "before-filter": {
      type: PropsType.Function,
      desc: "过滤函数调用前，所要调用的钩子函数，该函数接收要过滤的值作为参数。如果该函数的返回值是 false 或者是一个被拒绝的 Promise，那么接下来的过滤逻辑便不会执行",
      allowEmpty: true,
      args: ["value"],
      returnType: "boolean",
    },
    "popper-class": {
      type: PropsType.String,
      desc: "弹出内容的自定义类名",
      default: "",
    },
    teleported: {
      type: PropsType.Boolean,
      desc: "弹层是否使用 teleport",
      default: true,
    },
    "tag-type": {
      type: PropsType.Enum,
      enums: ["success", "info", "warning", "danger"],
      desc: "标签类型",
      allowEmpty: true,
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "是否触发表单验证",
      default: true,
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义备选项的节点内容，分别为当前节点的 Node 对象和数据",
      props: {},
    },
    empty: {
      label: ComponentLabel.NULL,
      desc: "无匹配选项时的内容",
      props: {},
    },
    prefix: {
      label: ComponentLabel.NULL,
      desc: "输入框头部内容",
      props: {},
      version: "2.9.4",
    },
    "suggestion-item": {
      label: ComponentLabel.NULL,
      desc: "搜索时自定义建议项内容",
      props: {},
      version: "2.9.5",
    },
  },
  events: {
    change: {
      name: "change",
      desc: "当绑定值变化时触发",
      args: ["value"],
    },
    expand: {
      name: "expand",
      desc: "展开节点时触发",
      args: ["value"],
    },
    blur: {
      name: "blur",
      desc: "当失去焦点时触发",
      args: ["event"],
    },
    focus: {
      name: "focus",
      desc: "当获得焦点时触发",
      args: ["event"],
    },
    clear: {
      name: "clear",
      desc: "当清空选项时触发",
      args: [],
    },
    "visible-change": {
      name: "visible-change",
      desc: "下拉框出现/隐藏时触发",
      args: ["visible"],
    },
    "remove-tag": {
      name: "remove-tag",
      desc: "在多选模式下，移除Tag时触发",
      args: ["tag"],
    },
  },
}
