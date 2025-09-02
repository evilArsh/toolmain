import { PropsType, RawComponent } from "../../../types"

export const ElColorPicker: RawComponent = {
  label: "el-color-picker",
  desc: "element-plus@el-color-picker",
  props: {
    "model-value": {
      type: PropsType.String,
      desc: "选中项绑定值",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "尺寸",
      allowEmpty: true,
    },
    "show-alpha": {
      type: PropsType.Boolean,
      desc: "是否支持透明度选择",
      default: false,
    },
    "color-format": {
      type: PropsType.Enum,
      enums: ["hsl", "hsv", "hex", "rgb"],
      desc: "写入 v-model 的颜色的格式",
      allowEmpty: true,
    },
    "popper-class": {
      type: PropsType.String,
      desc: "ColorPicker 下拉框的类名",
      allowEmpty: true,
    },
    predefine: {
      type: PropsType.JSON,
      desc: "预定义颜色",
      allowEmpty: true,
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "输入时是否触发表单的校验",
      default: true,
    },
    tabindex: {
      type: [PropsType.String, PropsType.Number],
      desc: "ColorPicker 的 tabindex",
      default: 0,
      finalType: PropsType.Number,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "ColorPicker 的 aria-label",
      allowEmpty: true,
      version: "2.7.2",
    },
    id: {
      type: PropsType.String,
      desc: "ColorPicker 的 id",
      allowEmpty: true,
    },
    teleported: {
      type: PropsType.Boolean,
      desc: "是否将 popover 的下拉列表渲染至 body 下",
      default: true,
      version: "2.7.2",
    },
  },
  events: {
    change: {
      name: "change",
      desc: "当绑定值变化时触发",
      args: ["value"],
    },
    "active-change": {
      name: "active-change",
      desc: "面板中当前显示的颜色发生改变时触发",
      args: ["color"],
    },
    focus: {
      name: "focus",
      desc: "当获得焦点时触发",
      args: ["event"],
      version: "2.4.0",
    },
    blur: {
      name: "blur",
      desc: "当失去焦点时触发",
      args: ["event"],
      version: "2.4.0",
    },
  },
}
