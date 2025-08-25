import { Router } from "./types"

export function pushRouterChild(router: Router, child: Router) {
  if (!router.children) router.children = []
  router.children.push(child)
}
