import type { Ref, Reactive } from "vue"

export enum VarsType {
  Primitive = "Primitive",
  Object = "Object",
  Array = "Array",
}

export interface Variable {
  /**
   * 唯一ID
   */
  id: string
  /**
   * 变量名字
   */
  name: string
  /**
   * 变量描述
   */
  desc: string
  /**
   * 变量类型
   */
  type: VarsType
  /**
   * 变量响应式类型
   */
  reactiveType: string
  value: Ref<unknown> | Reactive<Array<unknown> | Record<string, unknown>>
}

export type VariableStatic = Omit<Variable, "id" | "value" | "type"> & Partial<Pick<Variable, "id">> & { value?: any }
export type VariableSerialized = Omit<Variable, "value"> & { value: any }
export interface ComponentVarState {
  dispose: () => void
  createVariable: (config: VariableStatic) => Variable
  delVariable: (varId: string) => Variable | undefined
  getVariable: (varId: string) => Variable | undefined
  listVariable: () => Variable[]
  serialize: () => VariableSerialized[]
  deserialize: (data: VariableSerialized[]) => Variable[]
}
