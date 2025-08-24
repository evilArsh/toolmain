/**
 *  文件名以及路径名
 */
export const NameReg = /[^\\/:*?"<>|]+/
/**
 * 子页面标识
 */
export const SubpageReg = /\/subpages\//

/**
 * 组件标识
 */
export const ComponentReg = /\/components\//
/**
 * 文件扩展名 `.([jt]sx|vue)`
 */
export const FileExtReg = /\.([jt]sx|vue)$/
/**
 * 文件名
 */
export const FileReg = new RegExp(`${NameReg.source}(${FileExtReg.source})`)
/**
 * 路径分隔符
 */
export const SeparatorReg = /\//
/**
 * 路径分隔符
 */
export const Separator = "/"
export const Subpages = "subpages"
/**
 * 默认 `index.([jt]sx|vue)` 文件
 */
export const DefaultPathReg = new RegExp(`index${FileExtReg.source}`)
/**
 * 默认路径
 */
export const DefaultPath = "index"
/**
 *  包含views一级子目录的文件
 */
export const WithRootReg = new RegExp(`/src/views/${FileReg.source}`)
/**
 *  路径中带有 /component[s]/ 的组件文件.TODO: ios不支持零宽断言
 */
export const WithComponentReg = new RegExp(`components(/${NameReg.source}){0,}/${FileReg.source}`)
export const DefaultViewsDir = "/src/views/"
