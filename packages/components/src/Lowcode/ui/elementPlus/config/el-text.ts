import { PropsType, ComponentLabel, RawComponent } from "../../../types"

export default {
  label: "el-text",
  desc: "element-plus@el-text",
  props: {
    innerText: {
      type: PropsType.String,
      default: "默认文本",
      desc: "默认文本",
    },
    type: {
      type: PropsType.Enum,
      enums: ["primary", "success", "warning", "danger", "info"],
      desc: "类型",
      allowEmpty: true,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "大小",
      default: "default",
    },
    truncated: {
      type: PropsType.Boolean,
      desc: "显示省略号",
      default: false,
    },
    "line-clamp": {
      type: [PropsType.Number, PropsType.String],
      desc: "最大行数",
      version: "2.4.0",
      allowEmpty: true,
    },
    tag: {
      type: PropsType.String,
      desc: "自定义元素标签",
      default: "span",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "按钮默认插槽内容",
      props: {},
    },
  },
} as RawComponent
