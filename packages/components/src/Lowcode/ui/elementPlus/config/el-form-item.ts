import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElFormItem: RawComponent = {
  label: "el-form-item",
  desc: "element-plus@el-form-item",
  props: {
    prop: {
      type: [PropsType.String, PropsType.JSON],
      desc: "model 的键名。它可以是一个属性的值(如 a.b.0 或 ['a', 'b', '0'])。在使用了 validate、resetFields 的方法时，该属性是必填的",
      allowEmpty: true,
    },
    label: {
      type: PropsType.String,
      desc: "标签文本",
      allowEmpty: true,
    },
    "label-position": {
      type: PropsType.Enum,
      enums: ["left", "right", "top"],
      desc: "表单域标签的位置，当设置为 left 或 right 时，则也需要设置 label-width 属性。默认会继承 Form 的 label-position",
      default: "",
      version: "2.7.7",
    },
    "label-width": {
      type: [PropsType.String, PropsType.Number],
      desc: "标签宽度，例如 '50px'。可以使用 auto",
      default: "",
    },
    required: {
      type: PropsType.Boolean,
      desc: "是否为必填项，如不设置，则会根据校验规则确认",
      allowEmpty: true,
    },
    rules: {
      type: PropsType.JSON,
      desc: "表单验证规则, 具体配置见下表, 更多内容可以参考 async-validator",
      allowEmpty: true,
    },
    error: {
      type: PropsType.String,
      desc: "表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息",
      allowEmpty: true,
    },
    "show-message": {
      type: PropsType.Boolean,
      desc: "是否显示校验错误信息",
      default: true,
    },
    "inline-message": {
      type: [PropsType.String, PropsType.Boolean],
      desc: "是否在行内显示校验信息",
      default: "",
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "用于控制该表单域下组件的默认尺寸",
      allowEmpty: true,
    },
    for: {
      type: PropsType.String,
      desc: "和原生标签相同能力",
      allowEmpty: true,
    },
    "validate-status": {
      type: PropsType.Enum,
      enums: ["success", "error", "validating"],
      desc: "formitem 校验的状态",
      allowEmpty: true,
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
