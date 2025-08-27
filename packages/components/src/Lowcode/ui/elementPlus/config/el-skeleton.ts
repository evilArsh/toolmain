import { RawComponent, ComponentLabel, PropsType } from "../../../types"

export default {
  label: "el-skeleton",
  desc: "element-plus@el-skeleton",
  props: {
    animated: {
      type: PropsType.Boolean,
      default: false,
      desc: "是否使用动画",
    },
    count: {
      type: PropsType.Number,
      default: 1,
      desc: "渲染多少个 template, 建议使用尽可能小的数字",
    },
    loading: {
      type: PropsType.Boolean,
      default: true,
      desc: "是否显示加载结束后的 DOM 结构",
    },
    rows: {
      type: PropsType.Number,
      default: 1,
      desc: "骨架屏段落数量",
    },
    throttle: {
      type: [PropsType.Number, PropsType.JSON],
      default: 0,
      desc: "渲染延迟（以毫秒为单位） 数字代表延迟显示, 也可以设置为延迟隐藏, 例如 `{ leading: 500, trailing: 500 }` 当需要控制初始加载值时，您可以设置 `{ initVal: true }`",
      finalType: PropsType.Number,
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "真正渲染的DOM",
      props: {},
    },
    template: {
      label: ComponentLabel.NULL,
      desc: "渲染 skeleton 模板的内容",
      props: {},
    },
  },
} as RawComponent
