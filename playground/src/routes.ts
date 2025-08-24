import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"
import { localRoute } from "@toolmain/libs"
import { ParentView } from "@toolmain/components"
import { h } from "vue"

export const initNode = new localRoute.tpl.RouterTree({
  index: "/",
  layout: async () => ParentView,
  redirect: true,
  redirectToChild: true,
}).resolve(localRoute.fetch.fetchVue())
console.log(initNode.root)
// export const initRoutes = initNode.generate<RouteRecordRaw>(router => {
//   return {
//     path: router.path,
//     redirect: router.redirect,
//     children: [],
//     component: router.component ?? undefined,
//   } as RouteRecordRaw
// })
export const initRoutes = initNode.generate<RouteRecordRaw>()
console.log("[routes]", initRoutes)
const defaultPath = "/"
const router = createRouter({
  history: createWebHistory(),
  // routes: [initRoutes, { path: "/:pathMatch(.*)*", redirect: defaultPath }],
  routes: [
    {
      path: "/main",
      component: h("div", null, [h("p", "/main"), h(ParentView)]),
      children: [
        {
          path: "child",
          component: h("div", "/child"),
        },
        {
          path: "/child2",
          component: h("div", "/child2"),
        },
      ],
    },
  ],
})
console.log(router.getRoutes())
export default router
