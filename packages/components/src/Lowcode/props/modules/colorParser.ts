import { isColorProps, Props, PropsParser, PropsType, PropsValue } from "../types"

export class ColorParser implements PropsParser {
  propsType(): PropsType {
    return PropsType.Color
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: "",
    }
    if (isColorProps(props)) {
      dst.metaValue = dst.metaValue ?? dst.default
      dst.value = dst.metaValue
    } else {
      console.warn("[parse]", `props is not type of ${this.propsType()}`, props)
    }
    return dst
  }
}
