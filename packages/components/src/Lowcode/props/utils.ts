import { CallBackFn, isUndefined } from "@toolmain/shared"
import type { ComponentProvider, RawComponent } from "../types"
import { PropsGenerator, Props } from "./types"
import { ValueType, PropsType } from "./types"
import { ref } from "vue"

export function parseProp(propKey: string, prop: Props, parser: PropsGenerator, provider: ComponentProvider): unknown {
  let dstVal: undefined | unknown
  prop.finalType = getFinalType(prop)
  if (!prop.valueType || prop.valueType === ValueType.Static) {
    prop.valueType = ValueType.Static
    const parsed = parser.parse(prop)
    dstVal = parsed ? parsed.value : undefined
  } else if (prop.valueType === ValueType.Variable) {
    dstVal = undefined
    if (prop.variableId) {
      const v = provider.getVarState().getVariable(prop.variableId)
      if (v) {
        dstVal = v.value
        // dstVal = isRef(v.value) ? toValue(v.value) : toRaw(v.value)
      } else {
        console.warn("[parseProps] cannot find variable ", propKey, prop)
        dstVal = ref(undefined)
      }
    } else {
      console.warn("[parseProps] variableId is undefined")
      dstVal = ref(undefined)
    }
  } else {
    // TODO: implement
    dstVal = undefined
  }
  return dstVal
}
/**
 * @param [withoutUndefined=false] 是否过滤掉undefined的属性,default:false
 */
export function parseProps(
  newProps: Record<string, Props>,
  parser: PropsGenerator,
  provider: ComponentProvider,
  withoutUndefined: boolean = false
): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  Object.entries(newProps).forEach(([key, val]) => {
    if (isUndefined(val.metaValue) && !isUndefined(val.default)) {
      val.metaValue = val.default
    }
    const dst = parseProp(key, val, parser, provider)
    if (!withoutUndefined || (withoutUndefined && !isUndefined(dst))) {
      props[key] = dst
    }
  })
  return props
}

/**
 * 注册默认UI组件内部事件
 */
export const registerEvents = (
  instanceId: string,
  raw: RawComponent,
  provider?: ComponentProvider
): Record<string, CallBackFn> => {
  const props: Record<string, CallBackFn> = {}
  if (raw.events) {
    Object.entries(raw.events).forEach(([_, val]) => {
      props[val.name] = (...args: unknown[]) => {
        provider?.emit("DefaultEventsTrigger", { instanceId, eventName: val.name, data: args })
      }
    })
  }
  return props
}

/**
 * 推算出当前属性的最终类型
 */
export function getFinalType(props: Props): PropsType | undefined {
  if (props.finalType) return props.finalType
  let finalType: PropsType | undefined
  if (Array.isArray(props.type)) {
    if (!isUndefined(props.default)) {
      switch (typeof props.default) {
        case "string":
          finalType = PropsType.String
          break
        case "number":
          finalType = PropsType.Number
          break
        case "boolean":
          finalType = PropsType.Boolean
          break
        case "symbol":
          finalType = PropsType.Symbol
          break
        case "bigint":
          finalType = PropsType.BigInt
          break
        case "undefined":
          finalType = PropsType.Undefined
          break
        case "object":
          if (props.default === null) {
            finalType = PropsType.Null
          } else {
            finalType = PropsType.JSON
          }
          break
      }
    } else {
      finalType = props.type.length > 0 ? props.type[0] : undefined
    }
  } else {
    finalType = props.type
  }
  return finalType
}

/**
 * 元素默认属性
 */
export const defaultProps = (): Record<string, Props> => {
  return {
    style: {
      type: PropsType.String,
      allowEmpty: true,
      desc: "元素样式",
    },
    class: {
      type: PropsType.String,
      allowEmpty: true,
      desc: "元素css类名",
    },
    // draggable: {
    //   type: PropsType.Boolean,
    //   default: true,
    //   desc: "是否可拖拽",
    // },
  }
}
