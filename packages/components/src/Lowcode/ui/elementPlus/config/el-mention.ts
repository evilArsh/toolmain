import { ComponentLabel, PropsType, RawComponent } from "../../../types"
import { ElInput } from "./el-input"
import { cloneDeep } from "@toolmain/shared"
export const ElMention: RawComponent = {
  label: "el-mention",
  desc: "element-plus@el-mention",
  props: {
    options: {
      type: PropsType.JSON,
      desc: "提及选项列表",
      default: JSON.stringify([]),
    },
    prefix: {
      type: [PropsType.String, PropsType.JSON],
      desc: "触发字段的前缀。字符串长度必须且只能为 1",
      default: "@",
      finalType: PropsType.String,
    },
    split: {
      type: PropsType.String,
      desc: "用于拆分提及的字符。字符串长度必须且只能为 1",
      default: " ",
    },
    "filter-option": {
      type: [PropsType.Boolean, PropsType.Function],
      desc: "定制筛选器选项逻辑",
      allowEmpty: true,
      finalType: PropsType.Boolean,
      returnType: "boolean",
      args: ["pattern", "option"],
    },
    placement: {
      type: PropsType.String,
      desc: "设置弹出位置",
      default: "bottom",
    },
    "show-arrow": {
      type: PropsType.Boolean,
      desc: "下拉菜单的内容是否有箭头",
      default: false,
    },
    offset: {
      type: PropsType.Number,
      desc: "下拉面板偏移量",
      default: 0,
    },
    whole: {
      type: PropsType.Boolean,
      desc: "当退格键被按下做删除操作时，是否将提及部分作为整体删除",
      default: false,
    },
    "check-is-whole": {
      type: PropsType.Function,
      desc: "当退格键被按下做删除操作时，检查是否将提及部分作为整体删除",
      allowEmpty: true,
      args: ["pattern", "prefix"],
      returnType: "boolean",
    },
    loading: {
      type: PropsType.Boolean,
      desc: "提及的下拉面板是否处于加载状态",
      default: false,
    },
    "model-value": {
      type: PropsType.String,
      desc: "输入值",
      allowEmpty: true,
    },
    "popper-class": {
      type: PropsType.String,
      desc: "自定义浮层类名",
      allowEmpty: true,
    },
    "popper-options": {
      type: PropsType.JSON,
      desc: "popper.js 参数，参考 popper.js 文档",
      allowEmpty: true,
    },
    ...cloneDeep(ElInput.props),
  },
  events: {
    search: {
      name: "search",
      desc: "按下触发字段时触发",
      args: ["pattern", "prefix"],
    },
    select: {
      name: "select",
      desc: "当用户选择选项时触发",
      args: ["option", "prefix"],
    },
    ...cloneDeep(ElInput.events),
  },
  slots: {
    label: {
      label: ComponentLabel.NULL,
      desc: "自定义标签内容",
      props: {},
    },
    loading: {
      label: ComponentLabel.NULL,
      desc: "自定义 loading 内容",
      props: {},
    },
    header: {
      label: ComponentLabel.NULL,
      desc: "下拉列表顶部的内容",
      props: {},
    },
    footer: {
      label: ComponentLabel.NULL,
      desc: "下拉列表底部的内容",
      props: {},
    },
    ...cloneDeep(ElInput.slots),
  },
}
