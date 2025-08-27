import { ComponentLabel, RawComponent, PropsType } from "../../../types"
import { uniqueId } from "@toolmain/shared"

export default {
  label: "el-menu-item",
  desc: "element-plus@el-menu-item",
  props: {
    index: {
      type: [PropsType.String, PropsType.Null],
      desc: "唯一标志",
      finalType: PropsType.Null,
      default: uniqueId(),
    },
    innerText: {
      type: PropsType.String,
      default: "默认文本",
      desc: "el-menu-item文本",
    },
    route: {
      type: [PropsType.String, PropsType.JSON],
      desc: "`Vue Route` 路由位置参数",
      finalType: PropsType.String,
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
  },
  events: {
    click: {
      name: "click",
      desc: "点击菜单项时回调函数, 参数为菜单项实例",
      args: ["item:MenuItemRegistered"],
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义默认内容",
      props: {},
    },
    title: {
      label: ComponentLabel.NULL,
      desc: "自定义标题内容",
      props: {},
    },
  },
} as RawComponent
