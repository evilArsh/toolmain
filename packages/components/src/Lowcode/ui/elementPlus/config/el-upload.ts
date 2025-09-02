import { PropsType, ComponentLabel, RawComponent } from "../../../types"

export const ElUpload: RawComponent = {
  label: "el-upload",
  desc: "element-plus@el-upload",
  props: {
    "file-list": {
      type: PropsType.JSON,
      desc: "默认上传文件",
      default: JSON.stringify([]),
    },
    action: {
      type: PropsType.String,
      desc: "请求 URL",
      allowEmpty: false,
    },
    headers: {
      type: PropsType.JSON,
      desc: "设置上传的请求头部",
      allowEmpty: true,
    },
    method: {
      type: PropsType.String,
      desc: "设置上传请求方法",
      default: "post",
    },
    multiple: {
      type: PropsType.Boolean,
      desc: "是否支持多选文件",
      default: false,
    },
    data: {
      type: [PropsType.JSON, PropsType.Function],
      desc: "上传时附带的额外参数 从 v2.3.13 支持 Awaitable 数据，和 Function",
      args: ["rawFile"],
      returnType: "Awaitable<Record<string, any>>",
      allowEmpty: true,
    },
    name: {
      type: PropsType.String,
      desc: "上传的文件字段名",
      default: "file",
    },
    "with-credentials": {
      type: PropsType.Boolean,
      desc: "支持发送 cookie 凭证信息",
      default: false,
    },
    "show-file-list": {
      type: PropsType.Boolean,
      desc: "是否显示已上传文件列表",
      default: true,
    },
    drag: {
      type: PropsType.Boolean,
      desc: "是否启用拖拽上传",
      default: true,
    },
    accept: {
      type: PropsType.String,
      desc: "接受上传的文件类型（thumbnail-mode 模式下此参数无效）",
      default: "",
    },
    crossorigin: {
      type: PropsType.Enum,
      enums: ["anonymous", "use-credentials", ""],
      desc: "原生属性 crossorigin",
      allowEmpty: true,
    },
    "on-preview": {
      type: PropsType.Function,
      desc: "点击文件列表中已上传的文件时的钩子",
      args: ["uploadFile"],
      returnType: "void",
      allowEmpty: true,
    },
    "on-remove": {
      type: PropsType.Function,
      desc: "文件列表移除文件时的钩子",
      args: ["uploadFile", "uploadFiles"],
      returnType: "void",
      allowEmpty: true,
    },
    "on-success": {
      type: PropsType.Function,
      desc: "文件上传成功时的钩子",
      args: ["response", "uploadFile", "uploadFiles"],
      returnType: "void",
      allowEmpty: true,
    },
    "on-error": {
      type: PropsType.Function,
      desc: "文件上传失败时的钩子",
      args: ["error", "uploadFile", "uploadFiles"],
      returnType: "void",
      allowEmpty: true,
    },
    "on-progress": {
      type: PropsType.Function,
      desc: "文件上传时的钩子",
      args: ["evt", "uploadFile", "uploadFiles"],
      returnType: "void",
      allowEmpty: true,
    },
    "on-change": {
      type: PropsType.Function,
      desc: "文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用",
      args: ["uploadFile", "uploadFiles"],
      returnType: "void",
      allowEmpty: true,
    },
    "on-exceed": {
      type: PropsType.Function,
      desc: "当超出限制时，执行的钩子函数",
      args: ["files", "uploadFiles"],
      returnType: "void",
      allowEmpty: true,
    },
    "before-upload": {
      type: PropsType.Function,
      args: ["rawFile"],
      returnType: "Awaitable<void | undefined | null | boolean | File | Blob>",
      desc: "上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。",
      allowEmpty: true,
    },
    "before-remove": {
      type: PropsType.Function,
      desc: "删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。",
      args: ["uploadFile", "uploadFiles"],
      returnType: "Awaitable<boolean>",
      allowEmpty: true,
    },
    "list-type": {
      type: PropsType.Enum,
      enums: ["text", "picture", "picture-card"],
      desc: "文件列表的类型",
      default: "text",
    },
    "auto-upload": {
      type: PropsType.Boolean,
      desc: "是否自动上传文件",
      default: true,
    },
    "http-request": {
      type: PropsType.Function,
      desc: "覆盖默认的 Xhr 行为，允许自行实现上传文件的请求",
      args: ["options", "uploadFiles"],
      returnType: "XMLHttpRequest | Promise<unknown>",
      allowEmpty: true,
    },
    disabled: {
      type: PropsType.Boolean,
      desc: "是否禁用上传",
      default: false,
    },
    limit: {
      type: PropsType.Number,
      desc: "允许上传文件的最大数量",
      allowEmpty: true,
    },
  },
  slots: {
    default: {
      label: ComponentLabel.PLACEHOLDER,
      desc: "自定义默认内容",
      props: {},
    },
    trigger: {
      label: ComponentLabel.NULL,
      desc: "触发文件选择框的内容",
      props: {},
    },
    tip: {
      label: ComponentLabel.NULL,
      desc: "提示说明文字",
      props: {},
    },
    file: {
      label: ComponentLabel.NULL,
      desc: "缩略图模板的内容",
      props: {},
    },
  },
}
