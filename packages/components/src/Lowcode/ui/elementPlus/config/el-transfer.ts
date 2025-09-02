import { ComponentLabel, PropsType, RawComponent } from "../../../types"
export const ElTransfer: RawComponent = {
  label: "el-transfer",
  desc: "element-plus@el-transfer",
  props: {
    "model-value": {
      type: PropsType.JSON,
      desc: "选中项绑定值",
      default: JSON.stringify([]),
    },
    data: {
      type: PropsType.JSON,
      desc: "Transfer 的数据源",
      default: JSON.stringify([]),
    },
    filterable: {
      type: PropsType.Boolean,
      desc: "是否可搜索",
      default: false,
    },
    "filter-placeholder": {
      type: PropsType.String,
      desc: "搜索框占位符",
      allowEmpty: true,
    },
    "filter-method": {
      type: PropsType.Function,
      desc: "自定义搜索方法",
      allowEmpty: true,
      args: ["query", "item"],
      returnType: "boolean",
    },
    "target-order": {
      type: PropsType.Enum,
      enums: ["original", "push", "unshift"],
      desc: "右侧列表元素的排序策略：若为 original，则保持与数据源相同的顺序；若为 push，则新加入的元素排在最后；若为 unshift，则新加入的元素排在最前",
      default: "original",
    },
    titles: {
      type: PropsType.JSON,
      desc: "自定义列表标题",
      default: JSON.stringify([]),
    },
    "button-texts": {
      type: PropsType.JSON,
      desc: "自定义按钮文案",
      default: JSON.stringify([]),
    },
    "render-content": {
      type: PropsType.JSON,
      desc: "自定义数据项渲染函数",
      allowEmpty: true,
    },
    format: {
      type: PropsType.JSON,
      desc: "列表顶部勾选状态文案",
      default: JSON.stringify({}),
    },
    props: {
      type: PropsType.JSON,
      desc: "数据源的字段别名",
      allowEmpty: true,
    },
    "left-default-checked": {
      type: PropsType.JSON,
      desc: "初始状态下左侧列表的已勾选项的 key 数组",
      default: JSON.stringify([]),
    },
    "right-default-checked": {
      type: PropsType.JSON,
      desc: "初始状态下右侧列表的已勾选项的 key 数组",
      default: JSON.stringify([]),
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "是否触发表单验证",
      default: true,
    },
  },
  events: {
    change: {
      name: "change",
      desc: "右侧列表元素变化时触发",
      args: ["value", "direction", "movedKeys"],
    },
    "left-check-change": {
      name: "left-check-change",
      desc: "左侧列表元素被用户选中 / 取消选中时触发",
      args: ["checkedKeys", "checked"],
    },
    "right-check-change": {
      name: "right-check-change",
      desc: "右侧列表元素被用户选中 / 取消选中时触发",
      args: ["checkedKeys", "checked"],
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义数据项的内容，参数为 { option }",
      props: {},
    },
    "left-footer": {
      label: ComponentLabel.NULL,
      desc: "左侧列表底部的内容",
      props: {},
    },
    "right-footer": {
      label: ComponentLabel.NULL,
      desc: "右侧列表底部的内容",
      props: {},
    },
    "left-empty": {
      label: ComponentLabel.NULL,
      desc: "左侧面板为空或没有数据符合筛选条件时的内容",
      props: {},
      version: "2.9.0",
    },
    "right-empty": {
      label: ComponentLabel.NULL,
      desc: "右侧面板为空或没有数据符合筛选条件时的内容",
      props: {},
      version: "2.9.0",
    },
  },
}
