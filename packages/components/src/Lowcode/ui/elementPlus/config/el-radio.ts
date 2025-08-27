import { ComponentLabel, PropsType, RawComponent } from "../../../types"
export default {
  label: "el-radio",
  desc: "element-plus@el-radio",
  props: {
    "model-value": {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean],
      desc: "选中项绑定值",
      allowEmpty: true,
      finalType: PropsType.Boolean,
    },
    value: {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean],
      desc: "单选框的值",
      allowEmpty: true,
      finalType: PropsType.Boolean,
      version: "2.6.0",
    },
    label: {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean],
      desc: "单选框的 label",
      allowEmpty: true,
      finalType: PropsType.String,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用单选框",
      default: false,
    },
    border: {
      type: PropsType.Boolean,
      desc: "是否显示边框",
      default: false,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "单选框的尺寸",
      allowEmpty: true,
    },
    name: {
      type: PropsType.String,
      desc: "原生 name 属性",
      allowEmpty: true,
    },
  },
  events: {
    change: {
      name: "change",
      desc: "绑定值变化时触发的事件",
      args: ["value"],
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义默认内容",
      props: {},
    },
  },
} as RawComponent
