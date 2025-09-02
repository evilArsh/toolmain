import { PropsType, ComponentLabel, RawComponent } from "../../../types"

export const ElTabPaneComponent: RawComponent = {
  label: "el-tab-pane",
  desc: "element-plus@el-tab-pane",
  props: {
    label: {
      type: PropsType.String,
      default: "el-tab-pane标题",
      desc: "选项卡标题",
      finalType: PropsType.String,
    },
    disabled: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否禁用",
    },
    name: {
      type: [PropsType.String, PropsType.Number],
      default: "",
      finalType: PropsType.String,
      allowEmpty: true,
      desc: "与选项卡绑定值`value`对应的标识符，表示选项卡别名。默认值是tab面板的序列号，如第一个`tab`是`0`",
    },
    closable: {
      type: PropsType.Boolean,
      default: false,
      desc: "标签是否可关闭",
    },
    lazy: {
      type: PropsType.Boolean,
      default: false,
      desc: "标签是否延迟渲染",
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "Tab-pane 的内容",
      props: {},
    },
    label: {
      label: ComponentLabel.NULL,
      desc: "Tab-pane 的标题内容",
      props: {},
    },
  },
}
