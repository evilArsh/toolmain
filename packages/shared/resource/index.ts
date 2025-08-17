/**
 * 将字符串组装为路径格式
 *
 * @param path 路径或路径数组
 * @param withPrefix 是否需要 `/` 前缀
 * @default true
 *
 * @param withSuffix 是否需要 `/` 前缀
 * @default false
 *
 * @example eg: ["foo","bar"] ==> "foo/bar"
 */
export const resolvePath = (
  path: string | string[],
  withPrefix: boolean = true,
  withSuffix: boolean = false
): string => {
  let p = Array.isArray(path) ? path.join("/") : path
  const isNetworkPath = /^[a-zA-Z]+:\/\//.test(p)
  if (isNetworkPath) {
    return p.replace(/(?<!:\/)\/+/g, "/")
  }
  p = p.replace(/\/+/g, "/")
  p = p === "/" ? p : p.endsWith("/") && !withSuffix ? p.slice(0, -1) : p
  if (withPrefix) {
    p = p.startsWith("/") ? p : `/${p}`
  } else {
    p = p.startsWith("/") ? p.slice(1) : p
  }
  return p
}

/**
 * 本地图片资源
 * 将图片放入`src/assets/images` 目录下
 *
 * @example
 * ```ts
 * // `src/assets/images/logo.png`
 * const img = localImg('logo.png')
 * // `src/assets/images/foo/logo.png`
 * const img2 = localImg('foo/logo.png')
 * ```
 * @param path 图片相对路径
 */
export const localImg = (path: string) => {
  return new URL(`/src/assets/images/${path}`, import.meta.url).href
}

/**
 * 本地资源
 *
 * 将资源放入`src/assets` 目录下
 * @example
 * ```ts
 * // `src/assets/file.txt`
 * const img = localAssets('file.txt')
 * // `src/assets/foo/bar/logo.json`
 * const img2 = localAssets('foo/bar/logo.json')
 * ```
 * @param path 资源路径
 */
export const localAssets = (path: string) => {
  return new URL(`/src/assets/${path}`, import.meta.url).href
}
