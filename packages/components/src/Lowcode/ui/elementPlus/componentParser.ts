import * as ep from "element-plus"
import { isExtendProps, Props, ExtendPropsParser, PropsValue } from "../../types"
import { isString } from "@toolmain/shared"
import { Component, h } from "vue"
export const EpComponentFlag = "EpComponent"
export class EpComponentParser implements ExtendPropsParser {
  extendType(): string {
    return EpComponentFlag
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: undefined,
    }
    dst.metaValue = dst.metaValue ?? dst.default
    if (isExtendProps(dst) && dst.extendType === this.extendType()) {
      if (isString(dst.metaValue)) {
        let comp: Component | string
        // element-plus组件
        if (Object.hasOwn(ep, dst.metaValue) && dst.metaValue.startsWith("El")) {
          // @ts-expect-error only element-plus components will be generated
          comp = ep[dst.metaValue]
        } else {
          comp = dst.metaValue
        }
        dst.value = h(comp)
      } else {
        console.error("[parse component] unknown component name", props)
      }
    } else {
      console.error(`[parse component] props is not type of ${this.extendType()}`, props)
    }
    return dst
  }
}
