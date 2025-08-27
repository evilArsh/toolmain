import { Primitive } from "type-fest"
export enum ValueType {
  /**
   * 属性值为静态值
   */
  Static = "Static",
  /**
   * 属性值绑定为一个变量
   */
  Variable = "Variable",
  /**
   * 属性值从远程获取
   */
  Remote = "Remote",
}
// TODO Icon
export enum PropsType {
  // 基本数据类型
  Number = "Number",
  String = "String",
  Boolean = "Boolean",
  Undefined = "Undefined",
  Null = "Null",
  Symbol = "Symbol",
  BigInt = "BigInt",
  // 自定义数据类型
  Time = "Time",
  Color = "Color",
  JSON = "JSON",
  // Array = "Array",
  Enum = "Enum",
  Function = "Function",
  Icon = "Icon",
  /**
   * 表示为vue内置组件
   */
  Vue = "Vue",
  /**
   * 拓展类型拥有独立的解析器
   */
  Extend = "Extend",
  /**
   * 远程数据
   */
  // Remote = "Remote",
}
export interface BaseConfigProps {
  /**
   * 当属性存在多种类型时，要选择最终的类型
   */
  finalType?: PropsType
  /**
   * 该属性设置的值，最终生成的value用于赋值给组件
   */
  metaValue?: Primitive
  /**
   * 属性值类型，默认为`Static`
   */
  valueType?: ValueType
  /**
   * 当前属性为变量时的变量id
   */
  variableId?: string
  /**
   * 隐藏属性，不可配置
   */
  hidden?: boolean
  /**
   * 禁用属性，不可配置
   */
  disabled?: boolean
}
export interface BaseProps extends BaseConfigProps {
  /**
   * 默认预设值
   */
  default?: Primitive
  /**
   * 允许空值
   */
  allowEmpty?: boolean
  /**
   * 属性值描述
   */
  desc: string
  /**
   * 属性值所在版本
   */
  version?: string
}
export type PropsValue = Props & {
  value: unknown
}
export type CombArray<T> = T | T[]
/**
 * 基础数据类型的单个或者数组结构类型
 */
export interface PrimitiveProps extends BaseProps {
  type: CombArray<
    | PropsType.Number
    | PropsType.String
    | PropsType.Boolean
    | PropsType.Undefined
    | PropsType.Null
    | PropsType.Symbol
    | PropsType.BigInt
  >
}

export interface TimeProps extends BaseProps {
  type: PropsType.Time
  format?: string
}

export interface ColorProps extends BaseProps {
  type: PropsType.Color
}

export interface JSONProps extends BaseProps {
  type: PropsType.JSON
}

export interface EnumProps extends BaseProps {
  type: PropsType.Enum
  enums: Array<string | number | boolean>
}

export interface FunctionProps extends BaseProps {
  type: PropsType.Function
  /**
   * 实际的参数字符串会被传送到`Function`的参数中
   */
  args: string[]
  returnType: string
}

export interface VueProps extends BaseProps {
  type: PropsType.Vue
}

export interface ExtendProps extends BaseProps {
  type: PropsType.Extend
  extendType: string
}
export interface IconProps extends BaseProps {
  type: PropsType.Icon
}
export type MixedProps = BaseProps &
  Partial<Omit<PrimitiveProps, "type">> &
  Partial<Omit<ColorProps, "type">> &
  Partial<Omit<JSONProps, "type">> &
  Partial<Omit<TimeProps, "type">> &
  Partial<Omit<EnumProps, "type">> &
  Partial<Omit<FunctionProps, "type">> &
  Partial<Omit<VueProps, "type">> &
  Partial<Omit<ExtendProps, "type">> &
  Partial<Omit<IconProps, "type">> & {
    type: Array<PropsType>
  }

export type Props =
  | PrimitiveProps
  | ColorProps
  | JSONProps
  | TimeProps
  | EnumProps
  | FunctionProps
  | VueProps
  | ExtendProps
  | IconProps
  | MixedProps

export function isType(src: unknown, target: PropsType): boolean {
  return src === target
}
/**
 * 判断是否是基本数据类型
 */
export function isPrimitive(type: unknown): type is Primitive {
  return (
    typeof type === "string" ||
    typeof type === "number" ||
    typeof type === "boolean" ||
    typeof type === "bigint" ||
    typeof type === "symbol" ||
    type === undefined ||
    type === null
  )
}
export function isPrimitiveProps(props: Props): props is PrimitiveProps {
  const is = (type: unknown) => {
    return (
      type === PropsType.Boolean ||
      type === PropsType.Number ||
      type === PropsType.String ||
      type === PropsType.BigInt ||
      type === PropsType.Symbol ||
      type === PropsType.Undefined ||
      type === PropsType.Null
    )
  }
  if (Array.isArray(props.type)) {
    return props.type.every(is)
  } else {
    return is(props.type)
  }
}

export function isColorProps(props: Props): props is ColorProps {
  return props.finalType === PropsType.Color
}
export function isTimeProps(props: Props): props is TimeProps {
  return props.finalType === PropsType.Time
}
export function isJSONProps(props: Props): props is JSONProps {
  return props.finalType === PropsType.JSON
}

export function isEnumProps(props: Props): props is EnumProps {
  return props.finalType === PropsType.Enum
}

export function isFunctionProps(props: Props): props is FunctionProps {
  return props.finalType === PropsType.Function
}

export function isVueProps(props: Props): props is VueProps {
  return props.finalType === PropsType.Vue
}
export function isExtendProps(props: Props): props is ExtendProps {
  return props.finalType === PropsType.Extend
}
export function isIconProps(props: Props): props is IconProps {
  return props.finalType === PropsType.Icon
}

export interface PropsParser {
  parse(value: Props): PropsValue
  propsType(): PropsType
}

export interface ExtendPropsParser {
  parse(value: Props): PropsValue
  extendType(): string
}

export interface PropsGenerator {
  addParser(parser: PropsParser): this
  addExtendParser(extendParser: ExtendPropsParser): this
  getParsers(): PropsParser[]
  getExtendParsers(): ExtendPropsParser[]
  parse(props: Props): PropsValue | undefined
}
