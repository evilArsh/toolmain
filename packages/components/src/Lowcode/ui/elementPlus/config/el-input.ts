import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export default {
  label: "el-input",
  desc: "element-plus@el-input",
  props: {
    "model-value": {
      type: [PropsType.String, PropsType.Number],
      desc: "绑定值",
      finalType: PropsType.String,
      allowEmpty: true,
    },
    type: {
      type: PropsType.Enum,
      enums: ["text", "textarea", "password"],
      desc: "原生input类型",
      default: "text",
    },
    maxlength: {
      type: [PropsType.String, PropsType.Number],
      desc: "同原生`maxlength`属性",
      finalType: PropsType.Number,
      allowEmpty: true,
    },
    minlength: {
      type: [PropsType.String, PropsType.Number],
      desc: "原生属性，最小输入长度",
      finalType: PropsType.Number,
      allowEmpty: true,
    },
    "show-word-limit": {
      type: PropsType.Boolean,
      desc: "是否显示统计字数, 只在`type`为 'text' 或 'textarea' 的时候生效",
      default: false,
    },
    placeholder: {
      type: PropsType.String,
      desc: "输入框占位文本",
      allowEmpty: true,
    },
    clearable: {
      type: PropsType.Boolean,
      desc: "是否显示清除按钮，只有当 `type` 不是 textarea时生效",
      allowEmpty: true,
    },
    formatter: {
      type: PropsType.Function,
      desc: '指定输入值的格式。(只有当 `type` 是"text"时才能工作)',
      args: ["value"],
      returnType: "void",
      allowEmpty: true,
    },
    parser: {
      type: PropsType.Function,
      desc: '指定从格式化器输入中提取的值。(仅当 `type` 是"text"时才起作用)',
      args: ["value"],
      returnType: "void",
      allowEmpty: true,
    },
    "show-password": {
      type: PropsType.Boolean,
      desc: "是否显示切换密码图标",
      default: false,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    size: {
      type: PropsType.Enum,
      enums: ["large", "default", "small"],
      desc: "输入框尺寸，只在 `type` 不为 'textarea' 时有效",
      allowEmpty: true,
    },
    "prefix-icon": {
      type: PropsType.Icon,
      desc: "自定义前缀图标",
      allowEmpty: true,
    },
    "suffix-icon": {
      type: PropsType.Icon,
      desc: "自定义后缀图标",
      allowEmpty: true,
    },
    rows: {
      type: PropsType.Number,
      desc: "输入框行数，仅 `type` 为 'textarea' 时有效",
      allowEmpty: true,
    },
    autosize: {
      type: [PropsType.Boolean, PropsType.JSON],
      desc: "textarea 高度是否自适应，仅 `type` 为 'textarea' 时生效。 可以接受一个对象，比如: `{ minRows: 2, maxRows: 6 }`",
      default: false,
      finalType: PropsType.Boolean,
    },
    autocomplete: {
      type: PropsType.String,
      desc: "原生 `autocomplete` 属性",
      default: "off",
    },
    name: {
      type: PropsType.String,
      desc: "等价于原生 input `name` 属性",
      allowEmpty: true,
    },
    readonly: {
      type: PropsType.Boolean,
      desc: "原生 `readonly` 属性，是否只读",
      default: false,
    },
    max: {
      type: PropsType.Number,
      desc: "原生 `max` 属性，设置最大值",
      allowEmpty: true,
    },
    min: {
      type: PropsType.Number,
      desc: "原生属性，设置最小值",
      allowEmpty: true,
    },
    step: {
      type: PropsType.Number,
      desc: "原生属性，设置输入字段的合法数字间隔",
      allowEmpty: true,
    },
    resize: {
      type: PropsType.Enum,
      desc: "控制是否能被用户缩放",
      enums: ["none", "both", "horizontal", "vertical"],
      allowEmpty: true,
    },
    form: {
      type: PropsType.String,
      desc: "原生属性",
      allowEmpty: true,
    },
    "aria-label": {
      type: PropsType.String,
      desc: "等价于原生 input `aria-label` 属性",
      allowEmpty: true,
      version: "2.7.2",
    },
    tabindex: {
      type: [PropsType.String, PropsType.Number],
      desc: "输入框的 tabindex",
      finalType: PropsType.Number,
      allowEmpty: true,
    },
    "validate-event": {
      type: PropsType.Boolean,
      desc: "输入时是否触发表单的校验",
      default: true,
    },
    "input-style": {
      type: [PropsType.String, PropsType.JSON],
      desc: "input 元素或 textarea 元素的 style",
      finalType: PropsType.String,
      allowEmpty: true,
    },
  },
  slots: {
    prefix: {
      label: ComponentLabel.NULL,
      desc: '输入框头部内容，只对非 `type="textarea"` 有效',
      props: {},
    },
    suffix: {
      label: ComponentLabel.NULL,
      desc: '输入框尾部内容，只对非 `type="textarea"` 有效',
      props: {},
    },
    prepend: {
      label: ComponentLabel.NULL,
      desc: '输入框前置内容，只对非 `type="textarea"` 有效',
      props: {},
    },
    append: {
      label: ComponentLabel.NULL,
      desc: '输入框后置内容，只对非 `type="textarea"` 有效',
      props: {},
    },
  },
  events: {
    blur: {
      name: "blur",
      desc: "当选择器的输入框失去焦点时触发",
      args: ["event"],
    },
    focus: {
      name: "focus",
      desc: "当选择器的输入框获得焦点时触发",
      args: ["event"],
    },
    change: {
      name: "change",
      desc: "仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发",
      args: ["value"],
    },
    input: {
      name: "input",
      desc: "在 Input 值改变时触发",
      args: ["value"],
    },
    clear: {
      name: "clear",
      desc: "在点击由 clearable 属性生成的清空按钮时触发",
      args: [],
    },
  },
} as RawComponent
