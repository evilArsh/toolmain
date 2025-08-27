import { isString } from "@toolmain/shared"
import { isFunctionProps, Props, PropsParser, PropsType, PropsValue } from "../types"

export class FunctionParser implements PropsParser {
  propsType(): PropsType {
    return PropsType.Function
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: () => {},
    }
    if (isFunctionProps(props)) {
      dst.metaValue = props.metaValue ?? props.default ?? ""
      if (isString(dst.metaValue)) {
        // TODO: isolate code
        dst.value = new Function(props.args.join(","), dst.metaValue)
      } else {
        console.error("[parse function]", "code is not type of string", props)
      }
    } else {
      console.warn("[parse function]", `props is not type of ${this.propsType()}`, props)
    }
    return dst
  }
}
