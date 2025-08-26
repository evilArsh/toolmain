import { fetchVue, RouterTree } from "@toolmain/libs"
import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"

export const initNode = new RouterTree({
  index: "/",
}).resolve(fetchVue())
console.log(initNode.root)
export const initRoutes = initNode.iter<RouteRecordRaw>(router => {
  return router as RouteRecordRaw
})
console.log("[routes]", initRoutes)
const defaultPath = ""
const router = createRouter({
  history: createWebHistory(),
  routes: initRoutes.concat([{ path: "/:pathMatch(.*)*", redirect: defaultPath }]),
})
console.log(router.getRoutes())
export default router
