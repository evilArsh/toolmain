import type { AsyncComponnet } from "./types"
export class Node {
  private path: string
  private component?: AsyncComponnet
  private children: Node[]
  constructor(path: string) {
    this.path = path
    this.children = []
  }

  static create(path: string): Node {
    return new Node(path)
  }

  setComponent(component: AsyncComponnet | undefined): this {
    this.component = component
    return this
  }

  getComponent(): AsyncComponnet | undefined {
    return this.component
  }

  pushChild(node: Node): this {
    this.children.push(node)
    return this
  }
  /**
   * replace all chldren with new `nodes`
   */
  replaceChild(nodes: Node[]): this {
    this.children = nodes
    return this
  }

  getChild(): Node[] {
    return this.children
  }

  getPath(): string {
    return this.path
  }

  setPath(path: string): this {
    this.path = path
    return this
  }
}
