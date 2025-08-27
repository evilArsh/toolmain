import { isString } from "@toolmain/shared"
import { isJSONProps, Props, PropsParser, PropsType, PropsValue } from "../types"

export class JSONParser implements PropsParser {
  propsType(): PropsType {
    return PropsType.JSON
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: undefined,
    }
    try {
      if (isJSONProps(props)) {
        dst.metaValue = dst.metaValue ?? dst.default
        dst.value = isString(dst.metaValue) ? JSON.parse(dst.metaValue) : dst.metaValue
      } else {
        console.warn("[parse json]", `props is not type of ${this.propsType()}`, props)
      }
      return dst
    } catch (error) {
      console.error("[parse json]", error, props)
      return dst
    }
  }
}
