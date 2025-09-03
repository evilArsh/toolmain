import type { AsyncComponnet, IterableRoute, ResolveConfig, Router, RouterTreeConfig } from "./types"
import * as vars from "./variable"
import { Node } from "./node"
import { isUndefined, resolvePath } from "@toolmain/shared"
import { pushRouterChild } from "./utils"
export class RouterTree {
  readonly root: Node
  #routes: Map<string, Node>
  #__PREFIX__ = "__PREFIX__"
  #config: RouterTreeConfig
  constructor(config: RouterTreeConfig) {
    this.#routes = new Map()
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
      this.#routes.clear()
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
    const gen = (current: Node, absPath: string, currentRouter?: Router) => {
      const child = current.getChild()
      child.forEach(childNode => {
        // index.vue
        if (vars.DefaultPathReg.test(childNode.getPath())) {
          if (currentRouter) {
            // handle: /subpages/index.vue
            if (current.getPath() === vars.Subpages) {
              pushRouterChild(currentRouter, {
                path: childNode.getPath().replace(vars.FileExtReg, ""),
                component: childNode.getComponent(),
              })
            } else {
              currentRouter.component = childNode.getComponent()
            }
          } else {
            const router = routes.find(r => r.path === absPath)
            if (router) {
              if (!router.component) {
                router.component = childNode.getComponent()
              } else {
                // foo/index.vue 和 foo.vue 存在同级
                routes.push({
                  path: resolvePath([absPath, "index"]),
                  component: childNode.getComponent(),
                })
              }
            } else {
              routes.push({
                path: resolvePath(absPath),
                component: childNode.getComponent(),
              })
            }
          }
        } else if (vars.FileExtReg.test(childNode.getPath())) {
          // *.vue
          if (currentRouter) {
            pushRouterChild(currentRouter, {
              path: resolvePath(childNode.getPath().replace(vars.FileExtReg, ""), false, false),
              component: childNode.getComponent(),
            })
          } else {
            routes.push({
              path: resolvePath([absPath, childNode.getPath().replace(vars.FileExtReg, "")], true, false),
              component: childNode.getComponent(),
            })
          }
        } else if (childNode.getPath() == vars.Subpages || current.getPath() == vars.Subpages) {
          currentRouter = currentRouter ?? routes.find(r => r.path === absPath)
          if (!currentRouter) {
            currentRouter = {
              path: resolvePath(absPath),
              component: current.getComponent(),
              children: [],
            }
            routes.push(currentRouter)
          }
          if (childNode.getPath() == vars.Subpages) {
            gen(childNode, resolvePath(absPath), currentRouter)
          } else if (current.getPath() == vars.Subpages) {
            const r: Router = {
              path: childNode.getPath(),
              component: childNode.getComponent(),
              children: [],
            }
            if (currentRouter) {
              if (!currentRouter.children) currentRouter.children = []
              currentRouter.children.push(r)
              gen(childNode, resolvePath([absPath, childNode.getPath()]), r)
            } else {
              r.path = resolvePath([absPath, r.path])
              routes.push(r)
              gen(childNode, resolvePath([absPath, childNode.getPath()]), r)
            }
          }
        } else {
          gen(childNode, resolvePath([absPath, childNode.getPath()]), currentRouter)
        }
      })
    }
    this.root.getChild().forEach(topRoot => {
      if (vars.FileExtReg.test(topRoot.getPath())) {
        const path = topRoot.getPath().replace(vars.FileExtReg, "")
        routes.push({
          path: resolvePath([this.root.getPath(), resolvePath(path == vars.DefaultPath ? "/" : path)]),
          component: topRoot.getComponent(),
        })
      } else {
        gen(topRoot, resolvePath([this.root.getPath(), topRoot.getPath()]))
      }
    })
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
