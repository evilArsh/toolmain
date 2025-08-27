import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export default {
  label: "el-checkbox",
  desc: "element-plus@el-checkbox",
  props: {
    "model-value": {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean],
      desc: "选中项绑定值",
      allowEmpty: true,
      finalType: PropsType.Boolean,
    },
    value: {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean, PropsType.JSON],
      desc: "选中状态的值（只有在 checkbox-group 或者绑定对象类型为 array 时有效）",
      allowEmpty: true,
      version: "2.6.0",
      finalType: PropsType.String,
    },
    label: {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean, PropsType.JSON],
      desc: "选中状态的值，只有在绑定对象类型为 array 时有效。如果没有 value，label 则作为 value 使用",
      allowEmpty: true,
      finalType: PropsType.String,
    },
    "true-value": {
      type: [PropsType.String, PropsType.Number],
      desc: "选中时的值",
      allowEmpty: true,
      version: "2.6.0",
      finalType: PropsType.String,
    },
    "false-value": {
      type: [PropsType.String, PropsType.Number],
      desc: "没有选中时的值",
      allowEmpty: true,
      version: "2.6.0",
      finalType: PropsType.String,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
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
      desc: "Checkbox 的尺寸",
      allowEmpty: true,
    },
    name: {
      type: PropsType.String,
      desc: "原生 name 属性",
      allowEmpty: true,
    },
    checked: {
      type: PropsType.Boolean,
      desc: "当前是否勾选",
      default: false,
    },
    indeterminate: {
      type: PropsType.Boolean,
      desc: "设置不确定状态，仅负责样式控制",
      default: false,
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "输入时是否触发表单的校验",
      default: true,
    },
    tabindex: {
      type: [PropsType.String, PropsType.Number],
      desc: "输入框的 tabindex",
      allowEmpty: true,
      finalType: PropsType.String,
    },
    id: {
      type: PropsType.String,
      desc: "input id",
      allowEmpty: true,
    },
    "aria-controls": {
      type: PropsType.String,
      desc: "与 aria-control 一致，当 indeterminate 为 true 时生效",
      allowEmpty: true,
      version: "2.7.2",
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
      label: ComponentLabel.NULL,
      desc: "自定义默认内容",
      props: {},
    },
  },
} as RawComponent
