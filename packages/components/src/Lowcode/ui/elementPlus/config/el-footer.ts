import { ComponentLabel, PropsType, RawComponent } from "../../../types"

export const ElFooter: RawComponent = {
  label: "el-footer",
  desc: "element-plus@el-footer",
  props: {
    height: {
      type: PropsType.String,
      desc: "底栏高度",
      default: "60px",
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
