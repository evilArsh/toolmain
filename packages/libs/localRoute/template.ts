import type { AsyncComponnet, IterableRoute, ResolveConfig, Router, RouterTreeConfig } from "./types"
import * as vars from "./variable"
import { Node } from "./node"
import { isUndefined, resolvePath } from "@toolmain/shared"
function pushRouterChild(router: Router, child: Router) {
  if (!router.children) router.children = []
  router.children.push(child)
}

export class RouterTree {
  readonly root: Node
  #__PREFIX__ = "__PREFIX__"
  #config: RouterTreeConfig
  constructor(config: RouterTreeConfig) {
    this.#config = {
      ...config,
      index: config.index ?? "/",
      viewsDir: config.viewsDir ?? vars.DefaultViewsDir,
    }
    this.root = Node.create(this.#config.index)
  }
  /**
   * 返回当前文件夹根路径,默认`/src/views/`
   */
  setPrefix(prefix: string | RegExp): this {
    this.#config.viewsDir = prefix
    return this
  }
  /**
   * 设置文件夹根路径,默认`/src/views/`
   */
  getPrefix(): string | RegExp {
    return this.#config?.viewsDir ?? vars.DefaultViewsDir
  }
  /**
   * 解析组件目录结构并生成路由
   * @param records `import.meta.glob`之后的目录和组件集合
   */
  resolve(records: Record<string, AsyncComponnet>, cfg?: ResolveConfig): this {
    if (!cfg?.append) {
      this.root.replaceChild([])
    }
    Object.entries(records).forEach(kv => {
      this.add(kv[0], kv[1])
    })
    return this
  }
  /**
   * 对节点树进行遍历迭代
   */
  generate() {
    const routes: Router[] = []
    const gen = (current: Node, currentAbsPath: string, currentRouter?: Router) => {
      const children = current.getChild()
      children.forEach(child => {
        /**
         * index.*
         */
        if (vars.DefaultPathReg.test(child.getPath())) {
          if (currentRouter) {
            /**
             * |--foo
             * |  |--index.*
             */
            currentRouter.component = child.getComponent()
          } else {
            const router = routes.find(r => r.path === currentAbsPath)
            if (router) {
              if (!router.component) {
                router.component = child.getComponent()
              } else {
                /**
                 * |--foo
                 * |  |--index.*
                 * |--foo.*
                 */
                const fullPath = resolvePath([currentAbsPath, vars.DefaultPath])
                routes.push({
                  path: fullPath,
                  component: child.getComponent(),
                  fullPath,
                })
              }
            } else {
              const fullPath = resolvePath(currentAbsPath)
              routes.push({
                path: fullPath,
                component: child.getComponent(),
                fullPath,
              })
            }
          }
        } else {
          /**
           * foo.*
           */
          const isFile = vars.FileExtReg.test(child.getPath())
          currentRouter = currentRouter ?? routes.find(r => r.path === currentAbsPath)
          if (!currentRouter) {
            const fullPath = resolvePath(currentAbsPath)
            currentRouter = {
              path: fullPath,
              component: current.getComponent(),
              children: [],
              fullPath,
            }
            routes.push(currentRouter)
          }
          const currentPath = isFile ? child.getPath().replace(vars.FileExtReg, "") : child.getPath()
          const r: Router = {
            path: currentPath,
            component: child.getComponent(),
            children: [],
            fullPath: resolvePath([currentAbsPath, currentPath], true),
          }
          if (this.#config.redirect) {
            if (this.#config.redirectToChild) {
              if (!currentRouter.redirect) {
                currentRouter.redirect = r.fullPath
              }
            } else {
              if (r.path == vars.DefaultPath) {
                currentRouter.redirect = r.fullPath
              }
            }
          }
          pushRouterChild(currentRouter, r)
          if (!isFile) {
            gen(child, resolvePath([currentAbsPath, child.getPath()]), r)
          }
        }
      })
    }
    gen(this.root, this.root.getPath())
    return routes.sort((a, b) => b.path.length - a.path.length)
  }
  iter<T extends IterableRoute<T>>(callback: (node: Router) => T): T[] {
    const routes = this.generate()
    const iterate = (route: Router): T => {
      const dst: T = callback(route)
      if (route.children?.length) {
        dst.children = route.children.map(v => iterate(v))
      }
      return dst
    }
    return routes.map(route => iterate(route))
  }
  iterNode(callback: (node: Node) => Node | undefined): Node[] {
    const iterate = (route: Node): Node | undefined => {
      const dst: Node | undefined = callback(route)
      if (dst) {
        dst.replaceChild(
          dst
            .getChild()
            .map(v => iterate(v))
            .filter(n => !!n)
        )
      }
      return dst
    }
    return this.root
      .getChild()
      .map(route => iterate(route))
      .filter(n => !!n)
  }
  /**
   * 添加路由节点
   * @param path 路径 必须以`this.getPrefix()`开头
   * @param asyncComp 路径对应的 Component
   */
  add(path: string, asyncComp: AsyncComponnet): this {
    if (!path.replace(this.getPrefix(), this.#__PREFIX__).startsWith(this.#__PREFIX__)) {
      console.warn(`path must start with ${this.getPrefix()}`)
      return this
    }
    const fileName = path.slice(path.lastIndexOf("/") + 1)
    if (vars.FileReg.test(fileName)) {
      this.#push(resolvePath(path.replace(this.getPrefix(), ""), false, false), asyncComp)
    }
    return this
  }
  #push(path: string, comp: AsyncComponnet) {
    const pathArr = path.split(vars.Separator)
    let p: string | undefined
    let parent: Node = this.root
    let newNode: Node
    while (true) {
      p = pathArr.shift()
      if (isUndefined(p)) break
      const node = parent.getChild().find(v => v.getPath() === p)
      if (!node) {
        newNode = Node.create(p)
        if (vars.FileExtReg.test(p)) {
          newNode.setComponent(comp)
        }
        parent.pushChild(newNode)
        parent = newNode
      } else {
        if (vars.FileExtReg.test(p)) {
          node.setComponent(comp)
        }
        parent = node
      }
    }
  }
}
