import { h } from "vue"
import { PropsType } from "../types"
import { ComponentLabel, RawComponent } from "./types"

/**
 * 仅用于占位的元素
 */
export const placeholderRaw = (): RawComponent => {
  return {
    label: ComponentLabel.PLACEHOLDER,
    desc: "占位元素",
    props: {
      style: {
        type: PropsType.String,
        desc: "样式",
        default: `flex:1;width:100%;min-height:50px;min-width:100px;
        background-size: 20px 20px;
        background-position: 0px 0px, 10px 0px, 10px -10px, 0px 10px;
        background-image: linear-gradient(45deg, #d3d3d3 25%, #f000 25%),
        linear-gradient(135deg, #d3d3d3 25%, #0000 25%),
        linear-gradient(45deg, #0000 75%, #d3d3d3 75%),
        linear-gradient(135deg, #0000 75%, #d3d3d3 75%);`,
      },
    },
  }
}

export const placeholderNode = () => {
  return h("div")
}
