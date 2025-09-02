import { PropsType, RawComponent } from "../../../types"

export const ElRate: RawComponent = {
  label: "el-rate",
  desc: "element-plus@el-rate",
  props: {
    "model-value": {
      type: PropsType.Number,
      desc: "选中项绑定值",
      default: 0,
    },
    max: {
      type: PropsType.Number,
      desc: "最大分值",
      default: 5,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "尺寸",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否为只读",
      default: false,
    },
    "allow-half": {
      type: PropsType.Boolean,
      desc: "是否允许半选",
      default: false,
    },
    "low-threshold": {
      type: PropsType.Number,
      desc: "低分和中等分数的界限值，值本身被划分在低分中",
      default: 2,
    },
    "high-threshold": {
      type: PropsType.Number,
      desc: "高分和中等分数的界限值，值本身被划分在高分中",
      default: 4,
    },
    colors: {
      type: PropsType.JSON,
      desc: "icon 的颜色。若传入数组，共有 3 个元素，为 3 个分段所对应的颜色；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的颜色",
      default: JSON.stringify(["#f7ba2a", "#f7ba2a", "#f7ba2a"]),
    },
    "void-color": {
      type: PropsType.String,
      desc: "未选中 icon 的颜色",
      default: "#c6d1de",
    },
    "disabled-void-color": {
      type: PropsType.String,
      desc: "只读时未选中 icon 的颜色",
      default: "#eff2f7",
    },
    icons: {
      type: PropsType.JSON,
      desc: "图标组件 若传入数组，则需要传入 3 个元素，分别为 3 个部分所对应的类名；若传入对象，则可自定义分段，键名为分段的界限值，键值为对应的类名",
      allowEmpty: true,
    },
    "void-icon": {
      type: PropsType.Icon,
      desc: "未被选中的图标组件",
      allowEmpty: true,
    },
    "disabled-void-icon": {
      type: PropsType.Icon,
      desc: "禁用状态的未选择图标",
      allowEmpty: true,
    },
    "show-text": {
      type: PropsType.Boolean,
      desc: "是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容",
      default: false,
    },
    "show-score": {
      type: PropsType.Boolean,
      desc: "是否显示当前分数，show-score 和 show-text 不能同时为真",
      default: false,
    },
    "text-color": {
      type: PropsType.String,
      desc: "辅助文字的颜色",
      default: "",
    },
    texts: {
      type: PropsType.JSON,
      desc: "辅助文字数组",
      default: JSON.stringify(["Extremely bad", "Disappointed", "Fair", "Satisfied", "Surprise"]),
    },
    "score-template": {
      type: PropsType.String,
      desc: "分数显示模板",
      allowEmpty: true,
    },
    clearable: {
      type: PropsType.Boolean,
      desc: "是否可以重置值为 0",
      default: false,
      version: "2.2.18",
    },
    id: {
      type: PropsType.String,
      desc: "原生 id 属性",
      allowEmpty: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "和 Rate 的 aria-label 属性保持一致",
      allowEmpty: true,
      version: "2.7.2",
    },
  },
  events: {
    change: {
      name: "change",
      desc: "分值改变时触发",
      args: ["value"],
    },
  },
  slots: {},
}
