import { isEnumProps, Props, PropsParser, PropsType, PropsValue } from "../types"

export class EnumParser implements PropsParser {
  propsType(): PropsType {
    return PropsType.Enum
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: "",
    }
    if (isEnumProps(props)) {
      dst.metaValue = dst.metaValue ?? dst.default
      const optional = props.allowEmpty ? undefined : props.enums.length > 0 ? props.enums[0] : undefined
      dst.value = dst.metaValue ?? optional
    } else {
      console.warn("[parse enum]", `props is not type of ${this.propsType()}`, props)
    }
    return dst
  }
}
