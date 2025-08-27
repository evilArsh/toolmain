import { PropsType, ComponentLabel, RawComponent } from "../../../types"

export default {
  label: "el-tree",
  desc: "element-plus@el-tree",
  props: {
    data: {
      type: PropsType.JSON,
      desc: "展示数据",
      default: "[]",
      allowEmpty: true,
    },
    "empty-text": {
      type: PropsType.String,
      desc: "内容为空的时候展示的文本",
      allowEmpty: true,
    },
    "node-key": {
      type: PropsType.String,
      desc: "每个树节点用来作为唯一标识的属性，整棵树应该是唯一的",
      allowEmpty: true,
    },
    props: {
      type: PropsType.JSON,
      desc: "配置选项",
      default: JSON.stringify({ label: "label", children: "children", disabled: "disabled", isLeaf: "isLeaf" }),
    },
    "render-after-expand": {
      type: PropsType.Boolean,
      desc: "是否在第一次展开某个树节点后才渲染其子节点",
      default: true,
    },
    load: {
      type: PropsType.Function,
      desc: "加载子树数据的方法，仅当`lazy`属性为`true`时生效",
      args: ["node", "resolve", "reject"],
      returnType: "void",
    },
    "render-content": {
      type: PropsType.Function,
      desc: "树节点的内容区的渲染`Function`",
      args: ["h", "{ node, data, store }"],
      returnType: "void",
    },
    "highlight-current": {
      type: PropsType.Boolean,
      desc: "是否高亮当前选中节点，默认值是`false。`",
      default: false,
    },
    "default-expand-all": {
      type: PropsType.Boolean,
      desc: "是否默认展开所有节点",
      default: false,
    },
    "expand-on-click-node": {
      type: PropsType.Boolean,
      desc: "是否在点击节点的时候展开或者收缩节点， 默认值为`true`，如果为`false`，则只有点箭头图标的时候才会展开或者收缩节点。",
      default: false,
    },
    "check-on-click-node": {
      type: PropsType.Boolean,
      desc: "是否在点击节点的时候选中节点，默认值为`false`，即只有在点击复选框时才会选中节点。",
      default: false,
    },
    "auto-expand-parent": {
      type: PropsType.Boolean,
      desc: "展开子节点的时候是否自动展开父节点",
      default: true,
    },
    "default-expanded-keys": {
      type: PropsType.JSON,
      desc: "默认展开的节点的 key 的数组",
      default: "[]",
    },
    "show-checkbox": {
      type: PropsType.Boolean,
      desc: "节点是否可被选择",
      default: false,
    },
    "check-strictly": {
      type: PropsType.Boolean,
      desc: "在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为`false`",
      default: false,
    },
    "default-checked-keys": {
      type: PropsType.JSON,
      desc: "默认勾选的节点的 key 的数组",
      default: "[]",
    },
    "current-node-key": {
      type: [PropsType.String, PropsType.Number],
      desc: "当前选中的节点",
      finalType: PropsType.String,
    },
    "filter-node-method": {
      type: PropsType.Function,
      returnType: "boolean",
      args: ["value", "data", "node"],
      desc: "当前选中的节点",
      finalType: PropsType.String,
    },
    accordion: {
      type: PropsType.Boolean,
      desc: "是否每次只打开一个同级树节点展开",
      default: false,
    },
    indent: {
      type: PropsType.Number,
      desc: "相邻级节点间的水平缩进，单位为像素",
      default: 18,
    },
    icon: {
      type: [PropsType.String, PropsType.Number],
      desc: "自定义树节点图标组件",
      allowEmpty: true,
    },
    lazy: {
      type: PropsType.Boolean,
      desc: "是否懒加载子节点，需与`load`方法结合使用",
      default: false,
    },
    "allow-drag": {
      type: PropsType.Function,
      desc: "判断节点能否被拖拽 如果返回`false`，节点不能被拖动",
      args: ["node"],
      returnType: "boolean",
    },
    "allow-drop": {
      type: PropsType.Function,
      desc: "拖拽时判定目标节点能否成为拖动目标位置。 如果返回 false ，拖动节点不能被拖放到目标节点。 type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后",
      args: ["draggingNode", "dropNode", "type"],
      returnType: "boolean",
    },
    draggable: {
      type: PropsType.Boolean,
      desc: "是否开启拖拽节点功能",
      default: false,
    },
  },
  slots: {
    default: {
      label: ComponentLabel.NULL,
      desc: "自定义树节点的内容，自定义树节点的内容，参数为`{ node, data }`",
      props: {},
    },
    empty: {
      label: ComponentLabel.NULL,
      desc: "当数据为空时自定义的内容",
      props: {},
      version: "2.3.4",
    },
  },
  events: {
    "node-click": {
      name: "nodeClick",
      args: ["a", "b", "c", "d"],
      desc: "当节点被点击的时候触发。四个参数：对应于节点点击的节点对象，`TreeNode`的`node`属性,`TreeNode`和事件对象",
    },
    "node-contextmenu": {
      name: "nodeContextmenu",
      args: ["a", "b", "c", "d"],
      desc: "当某一节点被鼠标右键点击时会触发该事件。共四个参数，依次为：`event`、传递给`data`属性的数组中该节点所对应的对象、节点对应的`Node`、节点组件本身。",
    },
    "check-change": {
      name: "checkChange",
      args: ["a", "b", "c"],
      desc: "当复选框被点击的时候触发。共三个参数，依次为：传递给`data`属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点",
    },
    check: {
      name: "check",
      args: ["a", "b"],
      desc: "点击节点复选框之后触发。共两个参数，依次为：传递给`data`属性的数组中该节点所对应的对象、树目前的选中状态对象，包含`checkedNodes`、`checkedKeys`、`halfCheckedNodes`、`halfCheckedKeys`四个属性",
    },
    "node-expand": {
      name: "nodeExpand",
      args: ["a", "b", "c"],
      desc: "节点被展开时触发的事件。共三个参数，依次为：传递给`data`属性的数组中该节点所对应的对象、节点对应的`Node`、节点组件本身",
    },
    "node-collapse": {
      name: "nodeCollapse",
      args: ["a", "b", "c"],
      desc: "节点被关闭时触发的事件。共三个参数，依次为：传递给`data`属性的数组中该节点所对应的对象、节点对应的`Node`、节点组件本身",
    },
    "current-change": {
      name: "currentChange",
      args: ["a", "b"],
      desc: "当前选中节点变化时触发的事件。共两个参数，依次为：当前节点的数据，当前节点的`Node`对象",
    },
    "node-drag-start": {
      name: "nodeDragStart",
      args: ["a", "b"],
      desc: "节点开始拖拽时触发的事件。共两个参数，依次为：被拖拽节点对应的`Node`、`event`",
    },
    "node-drag-enter": {
      name: "nodeDragEnter",
      args: ["a", "b", "c"],
      desc: "拖拽进入其他节点时触发的事件。共三个参数，依次为：被拖拽节点对应的`Node`、所进入节点对应的`Node`、`event`",
    },
    "node-drag-leave": {
      name: "nodeDragLeave",
      args: ["a", "b", "c"],
      desc: "拖拽离开某个节点时触发的事件。共三个参数，依次为：被拖拽节点对应的`Node`、所离开节点对应的`Node`、`event`",
    },
    "node-drag-over": {
      name: "nodeDragOver",
      args: ["a", "b", "c"],
      desc: "在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）。共三个参数，依次为：被拖拽节点对应的`Node`、当前进入节点对应的`Node`、`event`",
    },
    "node-drag-end": {
      name: "nodeDragEnd",
      args: ["a", "b", "c", "d"],
      desc: "拖拽结束时（可能未成功）触发的事件。共四个参数，依次为：被拖拽节点对应的`Node`、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event",
    },
    "node-drop": {
      name: "nodeDrop",
      args: ["a", "b", "c", "d"],
      desc: "拖拽成功完成时触发的事件。共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event",
    },
  },
} as RawComponent
