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
