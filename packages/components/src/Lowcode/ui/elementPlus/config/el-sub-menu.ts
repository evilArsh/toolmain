import { ComponentLabel, PropsType, RawComponent } from "../../../types"
import { uniqueId } from "@toolmain/shared"

export default {
  label: "el-sub-menu",
  desc: "element-plus@el-sub-menu",
  props: {
    index: {
      type: PropsType.String,
      desc: "唯一标志`required`",
      default: uniqueId(),
      allowEmpty: false,
    },
    "popper-class": {
      type: PropsType.String,
      desc: "为 `popper` 添加类名",
      allowEmpty: true,
    },
    "show-timeout": {
      type: PropsType.Number,
      desc: "子菜单出现之前的延迟，(继承 `menu` 的 `show-timeout` 配置)",
      allowEmpty: true,
    },
    "hide-timeout": {
      type: PropsType.Number,
      desc: "子菜单消失之前的延迟，(继承 `menu` 的 `hide-timeout` 配置)",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用",
      default: false,
    },
    teleported: {
      type: PropsType.Boolean,
      desc: "是否将弹出菜单挂载到 `body` 上，第一级`SubMenu`默认值为 `true`，其他`SubMenus` 的值为 `false`",
      default: undefined,
    },
    "popper-offset": {
      type: PropsType.Number,
      desc: "弹出窗口的偏移量 (覆盖 `popper`的菜单)",
      allowEmpty: true,
    },
    "expand-close-icon": {
      type: PropsType.Icon,
      desc: "父菜单展开且子菜单关闭时的图标， `expand-close-icon` 和 `expand-open-icon` 需要一起配置才能生效",
      allowEmpty: true,
    },
    "expand-open-icon": {
      type: PropsType.Icon,
      desc: "父菜单展开且子菜单打开时的图标， `expand-close-icon` 和 `expand-open-icon` 需要一起配置才能生效",
      allowEmpty: true,
    },
    "collapse-close-icon": {
      type: PropsType.Icon,
      desc: "父菜单收起且子菜单关闭时的图标， `collapse-close-icon` 和 `collapse-open-icon` 需要一起配置才能生效",
      allowEmpty: true,
    },
    "collapse-open-icon": {
      type: PropsType.Icon,
      desc: "父菜单收起且子菜单打开时的图标， `collapse-open-icon` 和 `collapse-close-icon` 需要一起配置才能生效",
      allowEmpty: true,
    },
  },
  slots: {
    default: {
      label: ComponentLabel.PLACEHOLDER,
      desc: "占位",
      props: {},
    },
    title: {
      label: ComponentLabel.NULL,
      desc: "自定义标题内容",
      props: {},
    },
  },
} as RawComponent
