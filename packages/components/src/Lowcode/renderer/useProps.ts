import { isUndefined } from "@toolmain/shared"
import { BaseComponent, ComponentProvider, Props, ValueType, Variable } from "../types"
import { Primitive } from "type-fest"
import { isRef, toValue, toRaw } from "vue"

function getValue(val: unknown): unknown {
  return isRef(val) ? toValue(val) : toRaw(val)
}
export function modelValue(comp: BaseComponent, provider: ComponentProvider) {
  if (!Object.hasOwn(comp.raw.props, "model-value")) {
    return undefined
  }
  const rawProp = comp.raw.props["model-value"]
  if (rawProp.valueType === ValueType.Variable) {
    if (isUndefined(rawProp.variableId)) {
      console.warn(`[resolveProps] prop's type is Variable,but variableId is undefined,set to default`)
      return getValue(comp.props["model-value"])
    }
    const v: Variable | undefined = provider.getVarState().getVariable(rawProp.variableId!)
    if (v) {
      return getValue(v.value)
    } else {
      console.warn(`[resolveProps] cannot find variable by id ${rawProp.variableId},set to default`)
      return getValue(comp.props["model-value"])
    }
  } else if (rawProp.valueType === ValueType.Remote) {
    // TODO: Remote
    return rawProp.metaValue
  } else {
    return rawProp.metaValue
  }
}
export function onUpdateModelValue(val: unknown, comp: BaseComponent, provider: ComponentProvider) {
  if (!Object.hasOwn(comp.raw.props, "model-value")) {
    return undefined
  }
  const modelValue: Props = comp.raw.props["model-value"]
  if (modelValue.valueType === ValueType.Variable) {
    // console.log("[onUpdateModelValue Variable]", val)
    if (!modelValue.variableId) return
    const v: Variable | undefined = provider.getVarState().getVariable(modelValue.variableId)
    if (v) {
      if (isRef(v.value)) {
        v.value.value = val
      } else {
        // TODO: reactive
        console.warn("[onUpdateModelValue] unsupported variable type")
      }
    }
  } else if (modelValue.valueType === ValueType.Remote) {
    // TODO: Remote
    // console.log("[onUpdateModelValue Remote]", val)
  } else {
    // console.log("[onUpdateModelValue Static]", val)
    modelValue.metaValue = val as Primitive
    comp.props["model-value"] = val
  }
}
