import { isUndefined } from "@toolmain/shared"
import { ExtendProps, ExtendPropsParser, Props, PropsGenerator, PropsParser, PropsType, PropsValue } from "../types"
import { getFinalType } from "./utils"
import { ColorParser } from "./modules/colorParser"
import { EnumParser } from "./modules/enumParser"
import { FunctionParser } from "./modules/functionParser"
import { JSONParser } from "./modules/jsonParser"
import { PrimitiveParser } from "./modules/primitiveParser"
import { TimeParser } from "./modules/timeParser"
import { IconParser } from "./modules/iconParser"

export class PropsGeneratorImpl implements PropsGenerator {
  #parser: Map<PropsType, PropsParser>
  #extParser: Map<string, ExtendPropsParser>
  constructor() {
    this.#parser = new Map()
    this.#extParser = new Map()
    this.addParser(new PrimitiveParser(PropsType.Number))
      .addParser(new PrimitiveParser(PropsType.String))
      .addParser(new PrimitiveParser(PropsType.Boolean))
      .addParser(new PrimitiveParser(PropsType.Undefined))
      .addParser(new PrimitiveParser(PropsType.Null))
      .addParser(new PrimitiveParser(PropsType.Symbol))
      .addParser(new PrimitiveParser(PropsType.BigInt))
      .addParser(new ColorParser())
      .addParser(new IconParser())
      .addParser(new TimeParser())
      .addParser(new JSONParser())
      .addParser(new EnumParser())
      .addParser(new FunctionParser())
  }
  addParser(parser: PropsParser) {
    this.#parser.set(parser.propsType(), parser)
    return this
  }
  addExtendParser(extendParser: ExtendPropsParser) {
    this.#extParser.set(extendParser.extendType(), extendParser)
    return this
  }
  getParsers(): PropsParser[] {
    return Array.from(this.#parser.values())
  }
  getExtendParsers(): ExtendPropsParser[] {
    return Array.from(this.#extParser.values())
  }
  parse(props: Props): PropsValue | undefined {
    const meta = !isUndefined(props.metaValue) || !isUndefined(props.default)
    const finalType = getFinalType(props)
    if (!finalType) {
      console.error("[parse]", "finalType is undefined", props)
      return
    }
    if (meta) {
      if (!isUndefined(finalType)) {
        const parser =
          finalType === PropsType.Extend
            ? this.#extParser.get((props as ExtendProps).extendType)
            : this.#parser.get(finalType)
        if (parser) {
          return parser.parse(props)
        } else {
          console.error("[parse]", "cannot find parser for props", props)
        }
      } else {
        console.error("[parse]", "finalType is undefined", props)
      }
    } else {
      return {
        ...props,
        value: undefined,
      }
    }
  }
}
