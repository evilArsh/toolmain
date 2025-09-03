import { fetchVue, RouterTree } from "@toolmain/libs"
import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"

export const initNode = new RouterTree({
  index: "/",
}).resolve(fetchVue())
export const initRoutes = initNode.iter<RouteRecordRaw>(router => {
  return router as RouteRecordRaw
})
const defaultPath = "/playground"
const router = createRouter({
  history: createWebHistory(),
  routes: initRoutes.concat([
    {
      path: "/:pathMatch(.*)*",
      redirect: defaultPath,
    },
  ]),
})
console.log("[routes]", router.getRoutes())

export default router
