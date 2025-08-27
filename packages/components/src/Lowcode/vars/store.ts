import { effectScope, isReactive, isRef, reactive, Reactive, Ref, ref, shallowRef, toRaw, toValue } from "vue"
import { ComponentVarState, Variable, VariableSerialized, VariableStatic, VarsType } from "../types"
import { isUndefined, uniqueId } from "@toolmain/shared"
export const useVarState = (): ComponentVarState => {
  const scope = effectScope(true)
  const state = scope.run(() => {
    const vars = shallowRef<Record<string, Variable>>({})
    function generateValue(
      config: VariableStatic
    ): [Ref<unknown> | Reactive<Array<unknown> | Record<string, unknown>>, VarsType] {
      if (!isUndefined(config.value)) {
        try {
          const metaValue = typeof config.value === "string" ? JSON.parse(config.value) : config.value
          if (Array.isArray(metaValue)) {
            return [reactive(metaValue), VarsType.Array]
          } else if (typeof metaValue === "object") {
            if (metaValue === null) {
              return [ref(metaValue), VarsType.Primitive]
            } else {
              return [reactive(metaValue), VarsType.Object]
            }
          } else {
            return [ref(metaValue), VarsType.Primitive]
          }
        } catch (_e) {
          return [ref(config.value), VarsType.Primitive]
        }
      } else {
        return [ref(undefined), VarsType.Primitive]
      }
    }

    function createVariable(config: VariableStatic): Variable {
      const [value, type] = generateValue(config)
      const id = config.id || uniqueId()
      const v: Variable = {
        ...config,
        id,
        type,
        reactiveType: isRef(value) ? "ref" : isReactive(value) ? "reactive" : typeof value,
        value: value,
      }
      vars.value[v.id] = v
      return v
    }
    function delVariable(varId: string): Variable | undefined {
      const v = vars.value[varId]
      if (!v) return
      delete vars.value[varId]
      return v
    }
    function getVariable(varId: string): Variable | undefined {
      return vars.value[varId]
    }
    function listVariable(): Variable[] {
      return Object.values(vars.value)
    }
    function serialize(): VariableSerialized[] {
      return Object.values(vars.value).map<VariableSerialized>(v => {
        return {
          ...v,
          value: isRef(v.value) ? toValue(v.value) : toRaw(v.value),
        }
      })
    }
    function deserialize(data: VariableSerialized[]): Variable[] {
      return data.map<Variable>(v => createVariable(v))
    }
    function dispose() {
      scope.stop()
    }
    return {
      dispose,
      getVariable,
      delVariable,
      createVariable,
      listVariable,
      serialize,
      deserialize,
    }
  })!
  return state
}

export class VarState implements ComponentVarState {
  #s: ComponentVarState = useVarState()
  dispose() {
    this.#s.dispose()
  }
  createVariable(config: VariableStatic): Variable {
    return this.#s.createVariable(config)
  }
  delVariable(varId: string): Variable | undefined {
    return this.#s.delVariable(varId)
  }
  getVariable(varId: string): Variable | undefined {
    return this.#s.getVariable(varId)
  }
  listVariable(): Variable[] {
    return this.#s.listVariable()
  }
  serialize(): VariableSerialized[] {
    return this.#s.serialize()
  }
  deserialize(data: VariableSerialized[]): Variable[] {
    return this.#s.deserialize(data)
  }
}
