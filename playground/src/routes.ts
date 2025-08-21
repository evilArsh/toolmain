import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"
import { localRoute } from "@toolmain/libs"
import { ParentView } from "@toolmain/components"

export const initNode = new localRoute.tpl.RouterTree({
  index: "/",
  layout: async () => ParentView,
  redirect: true,
  redirectToChild: true,
}).resolve(localRoute.fetch.fetchVue())

export const initRoutes = initNode.iter<RouteRecordRaw>(router => {
  return {
    path: router.path,
    redirect: router.redirect,
    children: [],
    component: router.component ?? undefined,
  } as RouteRecordRaw
})
console.log("[routes]", initRoutes)
const defaultPath = "/"
const router = createRouter({
  history: createWebHistory(),
  routes: [initRoutes, { path: "/:pathMatch(.*)*", redirect: defaultPath }],
})
export default router
