import type { ValueType } from "style-value-types"
import { alpha, color, complex, degrees, filter, number, progressPercentage, px, scale } from "style-value-types"
import { CSSProperties } from "../types"

type ValueTypeMap = Record<string, ValueType>

/**
 * ValueType for "auto"
 */
// export const auto: ValueType = {
//   test: (v: any) => v === "auto",
//   parse: v => v,
// }

/**
 * ValueType for ints
 */
const int = {
  ...number,
  transform: Math.round,
}

export const styleValueTypes: ValueTypeMap = {
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,

  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,

  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  size: px,
  top: px,
  right: px,
  bottom: px,
  left: px,

  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,

  // Transform props
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px,

  // Misc
  zIndex: int,
  filter,
  WebkitFilter: filter,

  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int,
}

/**
 * 根据css`property`获取对应的值类型
 */
export const getStyleValueType = (property: string) => styleValueTypes[property]

/**
 * 将`value`转换为给定`type`类型的值
 *
 * @example
 * ```js
 * import { px, vh } from "style-value-types"
 * getStyleValueAsType(2,px) // '2px'
 * getStyleValueAsType(2,vh) // '2vh'
 * ```
 * @param value
 * @param type
 */
export function getStyleValueAsType(value: unknown, type?: ValueType) {
  return type && typeof value === "number" && type.transform ? type.transform(value) : value
}

/**
 * Get default animatable
 *
 * @param key
 * @param value
 */
export function getStyleAnimatableNone(key: string, value: string): any {
  let defaultValueType = getStyleValueType(key)
  if (defaultValueType !== filter) defaultValueType = complex
  // If value is not recognised as animatable, ie "none", create an animatable version origin based on the target
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : undefined
}

/**
 * 根据css`property`构造出正确类型的`value`
 *
 * @example
 * ```js
 * getStyleValue("width", 10) // "10px"
 * getStyleValue("border", "10px solid red") // "10px solid red"
 * ```
 */
export function getStyleValue(property: string, value?: string | number): any {
  const type = getStyleValueType(property)
  return getStyleValueAsType(value, type)
}

/**
 * 设置元素`ele`的样式
 *
 * @example
 * ```ts
 * const ele = document.getElementById("id")
 * setStyle(ele, {
 *   width: "10px",
 * })
 * ```
 */
export function setStyle(ele: HTMLElement, styles?: Partial<CSSProperties>) {
  if (!(ele && styles)) {
    return
  }
  Object.assign(ele.style, styles)
}
