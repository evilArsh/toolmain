import type { AsyncComponnet, IterableRoute, ResolveConfig, Router, RouterTreeConfig } from "./types"
import * as vars from "./variable"
import Node from "./node"
import { isUndefined, resolvePath } from "@toolmain/shared"
import { pushRouterChild } from "./utils"
export class RouterTree {
  readonly root: Node
  #routes: Map<string, Node>
  #__PREFIX__ = "__PREFIX__"
  #config: RouterTreeConfig
  #cache: Map<string, Node>
  constructor(config: RouterTreeConfig) {
    this.#routes = new Map()
    this.#config = {
      ...config,
      index: config.index ?? "/",
      viewsDir: config.viewsDir ?? vars.DefaultViewsDir,
    }
    this.#cache = new Map()
    this.root = Node.create(this.#config.index)
    this.root.setComponent(this.#config.layout)
    // this.#routes.set(this.root.getPath(), this.root)
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
  generate<T extends IterableRoute<T>>() {
    const routes: Router[] = []
    const gen = (current: Node, absPath: string, currentRouter?: Router) => {
      const child = current.getChild()
      child.forEach(childNode => {
        if (vars.DefaultPathReg.test(childNode.getPath())) {
          // index.vue
          if (currentRouter) {
            // handle: /subpages/index.vue
            if (current.getPath() === vars.Subpages) {
              pushRouterChild(currentRouter, {
                path: childNode.getPath().replace(vars.FileExtReg, ""),
                component: childNode.getComponent(),
              })
            } else {
              if (routes.find(v => v.path === current.getPath())) {
                // TODO
              } else {
                currentRouter.component = childNode.getComponent()
              }
            }
          } else {
            const router = routes.find(r => r.path === absPath)
            if (router) {
              router.component = childNode.getComponent()
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
    this.root.getChild().forEach(root => {
      if (vars.FileExtReg.test(root.getPath())) {
        const path = root.getPath().replace(vars.FileExtReg, "")
        routes.push({
          path: resolvePath(path),
          component: root.getComponent(),
        })
      } else {
        gen(root, root.getPath())
      }
    })
    return routes
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
      this.#push2(resolvePath(path.replace(this.getPrefix(), ""), false, false), asyncComp)
    }
    return this
  }
  #push2(path: string, comp: AsyncComponnet) {
    const pathArr = path.split(vars.Separator)
    let p: string | undefined
    let parent: Node = this.root
    let newNode: Node
    console.log(pathArr)
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
  find(path: string): Node | null {
    const p = resolvePath(path)
    const curNode: Node = this.root
    const cache = this.#cache.get(p)
    if (cache) {
      return cache
    }
    const res = this.#find(p, curNode.getPath(), curNode)
    if (res) {
      this.#cache.set(p, res)
      return res
    }
    return null
  }

  #find(dstPath: string, curPath: string, curNode: Node): Node | null {
    if (dstPath === curPath) {
      return curNode
    } else {
      const child = curNode.getChild()
      if (child.length > 0) {
        for (let i = 0; i < child.length; i++) {
          const res = this.#find(dstPath, resolvePath([curNode.getPath(), child[i].getPath()]), child[i])
          if (res) {
            return res
          }
        }
        return null
      } else {
        return null
      }
    }
  }

  /**
   * 添加路由
   * @param parent 要添加的路由的父节点
   * @param parentAbsPath 父节点绝对路由地址
   * @param path 要添加的路由地址
   * @param comp 要添加的路由对应的 Component
   */
  #push(parent: Node, parentAbsPath: string, path: string, comp: AsyncComponnet): void {
    if (path.length === 0) return
    const subCount = path.match(vars.SubpageReg)?.length ?? 0
    if (subCount === 0) {
      if (path.replace(vars.DefaultPathReg, "").length == 0) {
        parent.setComponent(comp)
      } else {
        const finalPath = resolvePath(path.replace(vars.DefaultPathReg, "").replace(vars.FileExtReg, ""))
        const currentPath = resolvePath(finalPath, false)
        // 路径: `{当前路径}`
        const childNode = Node.create(currentPath)
        // 路径映射:`/{绝对路径}/{当前路径}`
        this.#routes.set(resolvePath([parentAbsPath, currentPath]), childNode)
        childNode.setComponent(comp)
        parent.pushChild(childNode)
        if (this.#config.redirect) {
          const child = parent.getChild()
          const def = child.find(v => v.getPath() === vars.DefaultPath)
          if (def) {
            // parent.setRedirect(resolvePath([parentAbsPath, def.getPath()]))
          } else if (child.length > 0 && this.#config.redirectToChild) {
            // parent.setRedirect(resolvePath([parentAbsPath, child[0].getPath()]))
          }
        }
      }
    } else {
      const paths = path.split(vars.SubpageReg)
      const current = resolvePath([parentAbsPath, paths[0]])
      let currentNode = this.#routes.get(current)
      if (!currentNode) {
        currentNode = Node.create(paths[0])
        this.#routes.set(current, currentNode)
        parent.pushChild(currentNode)
      }
      this.#push(currentNode, current, resolvePath(paths.slice(1).join(resolvePath(vars.Subpages, true, true))), comp)
    }
  }
}
