import { fetchVue, RouterTree } from "@toolmain/libs"
import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"

export const initNode = new RouterTree({
  index: "/",
  redirect: true,
  redirectToChild: true,
}).resolve(fetchVue())

export const initRoutes = initNode.iter<RouteRecordRaw>(router => {
  return router as RouteRecordRaw
})

export const router = createRouter({
  history: createWebHistory(),
  routes: initRoutes.concat([
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ]),
})
// console.log("[root]", initNode.root)
console.log("[initRoutes]", initRoutes)
console.log("[routes]", router.getRoutes())
