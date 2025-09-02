import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElCard: RawComponent = {
  label: "el-card",
  desc: "element-plus@el-card",
  props: {
    header: {
      type: PropsType.String,
      allowEmpty: true,
      desc: "卡片的标题 你既可以通过设置 header 来修改标题，也可以通过 `slot#header` 传入 DOM 节点",
    },
    footer: {
      type: PropsType.String,
      allowEmpty: true,
      desc: "卡片页脚。 你既可以通过设置 footer 来修改卡片底部内容，也可以通过 `slot#footer` 传入 DOM 节点",
      version: "2.4.3",
    },
    "body-style": {
      type: PropsType.JSON,
      allowEmpty: true,
      desc: "body 的 CSS 样式",
    },
    "body-class": {
      type: PropsType.String,
      allowEmpty: true,
      desc: "body 的自定义类名",
      version: "2.3.10",
    },
    shadow: {
      type: PropsType.Enum,
      desc: "body 的自定义类名",
      enums: ["always", "never", "hover"],
      default: "always",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义默认内容",
      props: {},
    },
    header: {
      label: ComponentLabel.NULL,
      desc: "卡片标题内容",
      props: {},
    },
    footer: {
      label: ComponentLabel.NULL,
      desc: "卡片页脚内容",
      props: {},
    },
  },
}
