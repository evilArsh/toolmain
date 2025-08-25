export type Component = unknown
export type AsyncComponnet = () => Promise<Component>
export type Filter = ((value: string, index?: number, array?: string[]) => boolean) | RegExp | RegExp[]
export interface IterableRoute<T> {
  children?: T[] | null
}
/**
 * 每个路由元数据
 */
export interface RouterMeta {
  [key: string]: unknown
  title: string
  path: string
  fullPath: string
  redirect?: string
}
/**
 * 通用单个路由结构
 */
export interface Router {
  path: string
  // meta: RouterMeta
  redirect?: string
  component?: AsyncComponnet
  children?: Router[]
}
/**
 * 路由解析配置
 */
export interface ResolveConfig {
  /**
   * 在已有的基础上添加，否则清空 @default false
   */
  append?: boolean
}
/**
 * 路由数解析初始化配置
 */
export interface RouterTreeConfig {
  /**
   *  根路由,默认为 `/`
   */
  index: string
  /**
   *  路由根目录 @default `/src/views/`
   */
  viewsDir?: string | RegExp
}
/**
 * `import.meta.glob`加载路由数据配置
 */
export interface FetchConfig {
  /**
   * 是否包含带有`/component[s]`的路径
   */
  withComponents?: boolean
  /**
   * 过滤路径
   */
  filter?: Filter
}
