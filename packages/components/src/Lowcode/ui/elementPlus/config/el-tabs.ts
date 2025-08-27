import { PropsType, ComponentLabel, RawComponent } from "../../../types"

export default {
  label: "el-tabs",
  desc: "element-plus@el-tabs",
  props: {
    "model-value": {
      type: [PropsType.String, PropsType.Number],
      default: "",
      desc: "绑定值，选中选项卡的`name`，默认值是第一个`tab`的`name`",
      finalType: PropsType.String,
      allowEmpty: true,
    },
    type: {
      type: PropsType.Enum,
      enums: ["", "card", "border-card"],
      default: "",
      desc: "风格类型",
    },
    closable: {
      type: PropsType.Boolean,
      default: false,
      desc: "标签是否可关闭",
    },
    addable: {
      type: PropsType.Boolean,
      default: false,
      desc: "标签是否可增加",
    },
    editable: {
      type: PropsType.Boolean,
      default: false,
      desc: "标签是否同时可增加和关闭",
    },
    "tab-position": {
      type: PropsType.Enum,
      enums: ["top", "right", "bottom", "left"],
      default: "top",
      desc: "选项卡所在位置",
    },
    stretch: {
      type: PropsType.Boolean,
      default: false,
      desc: "标签的宽度是否自撑开",
    },
    "before-leave": {
      type: PropsType.Function,
      default: "return true",
      args: ["activeName", "oldActiveName"],
      returnType: "Awaitable<void | boolean>",
      desc: "切换标签之前的钩子函数，若返回`false`或者返回被`reject`的`Promise`，则阻止切换。",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "默认插槽",
      props: {},
    },
    "add-icon": {
      label: ComponentLabel.NULL,
      desc: "自定义添加按钮图标",
      version: "2.5.4",
      props: {},
    },
  },
  events: {
    tabClick: {
      name: "tabClick",
      desc: "`tab`被选中时触发",
      args: ["pane", "ev"],
    },
    tabChange: {
      name: "tabChange",
      desc: "`activeName`改变时触发",
      args: ["name"],
    },
    tabRemove: {
      name: "tabRemove",
      desc: "点击`tab`移除按钮时触发",
      args: ["name"],
    },
    tabAdd: {
      name: "tabAdd",
      desc: "点击 tab 新增按钮时触发",
      args: [],
    },
    tabEdit: {
      name: "tabEdit",
      desc: "点击 tab 的新增或移除按钮后触发",
      args: ["paneName", "action"],
    },
  },
} as RawComponent
