# 用法

```typescript
import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"
import { fetchVue, RouterTree } from "@toolmain/libs"

export const initNode = new localRoute.tpl.RouterTree({
  index: "/",
}).resolve(fetchVue())

export const initRoutes = initNode.iter<RouteRecordRaw>(router => {
  return router as RouteRecordRaw
})
const router = createRouter({
  history: createWebHistory(),
  routes: [...initRoutes, { path: "/:pathMatch(.*)*", redirect: defaultPath }],
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
|  |  |--profile
|  |  |  |--home
|  |  |  |  |--index.vue
|  |  |  |  |--home-test.vue
|  |  |  |--profile
|  |  |  |  |--index.vue
|  |  |  |--index.vue
```

1. 非 `index.*` 结尾的文件会被解析为独立的路由，比如 `/web/profile/home/home-test`

2. 当目录下存在 `index.*` 时，该目录会被视为存在子路由，比如在 `/web/profile` 中，`home` 和 `profile` 会被放在路由的 `children` 中，不存在时，顶级 `<router-view>` 将跳过父级并仅使用子路由组件，比如 `/web/user/A` 将直接作为根路由
