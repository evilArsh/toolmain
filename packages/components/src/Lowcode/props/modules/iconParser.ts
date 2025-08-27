import { isIconProps, Props, PropsParser, PropsType, PropsValue } from "../types"

export class IconParser implements PropsParser {
  propsType(): PropsType {
    return PropsType.Icon
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: "",
    }
    if (isIconProps(props)) {
      dst.metaValue = dst.metaValue ?? dst.default
      dst.value = dst.metaValue
    } else {
      console.warn("[parse]", `props is not type of ${this.propsType()}`, props)
    }
    return dst
  }
}
