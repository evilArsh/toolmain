import dayjs from "dayjs"
import { isTimeProps, Props, PropsParser, PropsType, PropsValue } from "../types"

export class TimeParser implements PropsParser {
  propsType(): PropsType {
    return PropsType.Time
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: "",
    }
    try {
      if (isTimeProps(props)) {
        dst.metaValue = dst.metaValue ?? dst.default
        dst.value = dayjs(dst.metaValue as unknown as any).format(props.format)
      } else {
        console.warn("[parse]", `props is not type of ${this.propsType()}`, props)
      }
    } catch (error) {
      console.error("[TimeParser]", error)
    }
    return dst
  }
}
