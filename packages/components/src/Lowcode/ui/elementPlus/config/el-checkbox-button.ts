import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElCheckboxButton: RawComponent = {
  label: "el-checkbox-button",
  desc: "element-plus@el-checkbox-button",
  props: {
    value: {
      type: [PropsType.String, PropsType.Number, PropsType.Boolean, PropsType.JSON],
      desc: "选中状态的值，只有在绑定对象类型为 array 时有效",
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
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义默认内容",
      props: {},
    },
  },
}
