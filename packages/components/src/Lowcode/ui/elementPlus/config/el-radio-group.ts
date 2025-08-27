import { ComponentLabel, PropsType, RawComponent } from "../../../types"
export default {
  label: "el-radio-group",
  desc: "element-plus@el-radio-group",
  props: {
    "model-value": {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean],
      desc: "绑定值",
      allowEmpty: true,
      finalType: PropsType.String,
    },
    size: {
      type: PropsType.String,
      desc: "单选框按钮或边框按钮的大小",
      default: "default",
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    "text-color": {
      type: PropsType.String,
      desc: "按钮形式的 Radio 激活时的文本颜色",
      default: "#ffffff",
    },
    fill: {
      type: PropsType.String,
      desc: "按钮形式的 Radio 激活时的填充色和边框色",
      default: "#409eff",
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "输入时是否触发表单的校验",
      default: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "与 RadioGroup 中的 aria-label 属性相同",
      allowEmpty: true,
      version: "2.7.2",
    },
    name: {
      type: PropsType.String,
      desc: "原生 name 属性",
      allowEmpty: true,
    },
    id: {
      type: PropsType.String,
      desc: "原生 id 属性",
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
      label: ComponentLabel.PLACEHOLDER,
      desc: "占位",
      props: {},
    },
  },
} as RawComponent
