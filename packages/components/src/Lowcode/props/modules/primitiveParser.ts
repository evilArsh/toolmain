import { Primitive } from "type-fest"
import { Props, PropsParser, PropsType, PropsValue } from "../types"

export class PrimitiveParser implements PropsParser {
  #type: PropsType
  constructor(type: PropsType) {
    this.#type = type
  }
  propsType(): PropsType {
    return this.#type
  }
  parse(props: Props): PropsValue {
    const dst: PropsValue = {
      ...props,
      value: null,
    }
    dst.metaValue = dst.metaValue ?? dst.default
    let value: Primitive = dst.metaValue
    switch (this.#type) {
      case PropsType.Number:
        value = Number(value)
        break
      case PropsType.String:
        value = String(value)
        break
      case PropsType.Boolean:
        value = Boolean(value)
        break
      case PropsType.Undefined:
        value = undefined
        break
      case PropsType.Null:
        value = null
        break
      // case PropsType.Symbol:
      //   break
      // case PropsType.BigInt:
      //   break
    }
    dst.value = value
    return dst
  }
}
