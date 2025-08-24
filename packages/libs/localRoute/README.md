# 用法

```typescript
import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"
import { localRoute } from "@toolmain/libs"

export const initNode = new localRoute.tpl.RouterTree({
  index: "/",
  layout: async () => await import("path/to/layout/component.vue"),
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
const defaultPath = "/index"
const router = createRouter({
  history: createWebHistory(),
  routes: [
    initRoutes,
    { path: "", redirect: defaultPath },
    { path: "/", redirect: defaultPath },
    { path: "/:pathMatch(.*)*", redirect: defaultPath },
  ],
})
export default router
```

## 路径解析

`/src/views/` 为根目录，如果 `src/` 目录存在以下结构，并且路由前缀为 `/`

```plaintext
|--views
|  |--web
|  |  |--login
|  |  |  |--A
|  |  |  |  |--index.vue
|  |  |--index.vue
|  |  |--user
|  |  |  |--A
|  |  |  |  |--index.vue
|  |  |  |--B
|  |  |  |  |--index.vue
|  |  |--subpages
|  |  |  |--home
|  |  |  |  |--index.vue
|  |  |  |--profile
|  |  |  |  |--index.vue
|  |  |  |--index.vue
```

1. `user/` 和 `login/` 目录不在 `subpages/` 目录下，会被解析为 `/web/user` 和 `/web/login` 根路由，顶级 `<router-view>` 将跳过父级 `/web` 并仅使用子路由组件。

2. `subpages/` 目录下的 `home/` 和 `profile/` 被视为 `/web` 的子路由，最终路由为 `/web/home` 和 `/web/profile` 。只有 `web/` 目录下存在 `index.vue` 文件并且存在 `<router-view>` 才会渲染出子组件
