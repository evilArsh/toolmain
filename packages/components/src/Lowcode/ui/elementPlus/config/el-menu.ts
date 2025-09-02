import { RawComponent, PropsType, ComponentLabel } from "../../../types"

export const ElMenu: RawComponent = {
  label: "el-menu",
  desc: "element-plus@el-menu",
  props: {
    mode: {
      type: PropsType.Enum,
      enums: ["horizontal", "vertical"],
      desc: "菜单展示模式",
      default: "vertical",
    },
    collapse: {
      type: PropsType.Boolean,
      desc: "是否水平折叠收起菜单（仅在 `mode` 为 `vertical` 时可用）",
      default: false,
    },
    ellipsis: {
      type: PropsType.Boolean,
      desc: "是否省略多余的子项（仅在横向模式生效）",
      default: true,
    },
    "ellipsis-icon": {
      type: PropsType.Icon,
      desc: "自定义省略图标 (仅在水平模式下可用)",
      version: "2.4.4",
      allowEmpty: true,
    },
    "popper-offset": {
      type: PropsType.Number,
      desc: "弹出层的偏移量(对所有子菜单有效)",
      version: "2.4.4",
      default: 6,
    },
    "default-active": {
      type: PropsType.String,
      desc: "页面加载时默认激活菜单的 `index`	",
      default: "",
    },
    "default-openeds": {
      type: PropsType.JSON,
      desc: "默认打开的 `sub-menu` 的 `index` 的数组",
      default: "[]",
    },
    "unique-opened": {
      type: PropsType.Boolean,
      desc: "是否只保持一个子菜单的展开",
      default: false,
    },
    "menu-trigger": {
      type: PropsType.Enum,
      enums: ["hover", "click"],
      desc: "子菜单打开的触发方式，只在 `mode` 为 `horizontal` 时有效。",
      default: "hover",
    },
    router: {
      type: PropsType.Boolean,
      desc: "是否启用 `vue-router` 模式。 启用该模式会在激活导航时以 `index` 作为 `path` 进行路由跳转 使用 `default-active` 来设置加载时的激活项。",
      default: false,
    },
    "collapse-transition": {
      type: PropsType.Boolean,
      desc: "是否开启折叠动画",
      default: true,
    },
    // TODO: 混合类型下如何推导参数,eg:enums:
    "popper-effect": {
      // type: [PropsType.Enum, PropsType.String],
      type: PropsType.Enum,
      enums: ["dark", "light"],
      desc: "Tooltip 主题，内置了 `dark` / `light` 两种主题，当菜单折叠时生效。",
      default: "dark",
      version: "2.2.26",
    },
    "close-on-click-outside": {
      type: PropsType.Boolean,
      desc: "可选，单击外部时是否折叠菜单",
      default: false,
      version: "2.4.4",
    },
    "popper-class": {
      type: PropsType.String,
      desc: "为 `popper` 添加类名",
      version: "2.5.0",
      allowEmpty: true,
    },
    "show-timeout": {
      type: PropsType.Number,
      desc: "菜单出现前的延迟",
      version: "2.5.0",
      default: 300,
    },
    "hide-timeout": {
      type: PropsType.Number,
      desc: "菜单消失前的延迟",
      version: "2.5.0",
      default: 300,
    },
  },
  slots: {
    default: {
      label: ComponentLabel.PLACEHOLDER,
      desc: "占位",
      props: {},
    },
  },
  events: {
    select: {
      name: "select",
      desc: "菜单激活回调",
      args: ["event"],
    },
    open: {
      name: "open",
      desc: "`sub-menu`展开的回调",
      args: ["event"],
    },
    close: {
      name: "close",
      desc: "`sub-menu`收起的回调",
      args: ["event"],
    },
  },
}
