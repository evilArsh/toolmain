import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElCheckboxGroup: RawComponent = {
  label: "el-checkbox-group",
  desc: "element-plus@el-checkbox-group",
  props: {
    "model-value": {
      type: PropsType.JSON,
      desc: "绑定值",
      default: JSON.stringify([]),
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "多选框组尺寸",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    min: {
      type: PropsType.Number,
      desc: "可被勾选的 checkbox 的最小数量",
      allowEmpty: true,
    },
    max: {
      type: PropsType.Number,
      desc: "可被勾选的 checkbox 的最大数量",
      allowEmpty: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "原生 aria-label 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    "text-color": {
      type: PropsType.String,
      desc: "当按钮为活跃状态时的字体颜色",
      default: "#ffffff",
    },
    fill: {
      type: PropsType.String,
      desc: "当按钮为活跃状态时的边框和背景颜色",
      default: "#409eff",
    },
    tag: {
      type: PropsType.String,
      desc: "复选框组元素标签",
      default: "div",
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
      desc: "当绑定值变化时触发的事件",
      args: ["value"],
    },
  },
  slots: {
    default: {
      label: ComponentLabel.PLACEHOLDER,
      desc: "占位",
      props: {},
    },
  },
}
