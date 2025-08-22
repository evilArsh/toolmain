import { Core } from "./core"
import { LoadParam } from "./types"
import { LoaderPure } from "./loaderPure"

export class Loader extends LoaderPure {
  // private core: Core
  data: Record<string, LoadParam> = {}
  constructor(_core: Core) {
    super()
    // this.core = core
  }
  dispose() {
    this.data = {}
    super.dispose()
  }
}
