import vue from "@vitejs/plugin-vue"
import Unocss from "unocss/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { ConfigEnv, defineConfig, UserConfig, searchForWorkspaceRoot } from "vite"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import VueDevTools from "vite-plugin-vue-devtools"

const __dirname = dirname(fileURLToPath(import.meta.url))
// import { visualizer } from "rollup-plugin-visualizer"
const defaultConfig = (_mode: string, _command: string): UserConfig => {
  const config: UserConfig = {
    base: "/",
    root: "./",
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
      open: false,
    },
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        {
          find: "@toolmain/components",
          replacement: resolve(searchForWorkspaceRoot(__dirname), "packages/components"),
        },
        { find: "@toolmain/element", replacement: resolve(searchForWorkspaceRoot(__dirname), "packages/element") },
        { find: "@toolmain/shared", replacement: resolve(searchForWorkspaceRoot(__dirname), "packages/shared") },
        { find: "@toolmain/libs", replacement: resolve(searchForWorkspaceRoot(__dirname), "packages/libs") },
      ],
    },
    plugins: [
      VueDevTools(),
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith("ce-"),
          },
        },
      }),
      vueJsx(),
      Icons({}),
      Unocss(),
      AutoImport({
        imports: ["vue"],
        vueTemplate: true,
        dts: false,
        resolvers: [IconsResolver(), ElementPlusResolver()],
      }),
      Components({
        resolvers: [
          IconsResolver(),
          ElementPlusResolver({
            importStyle: "sass",
          }),
        ],
        dts: false,
        globs: ["./src/components/*/index.vue"],
      }),
    ],
  }
  return config
}

export default ({ mode, command }: ConfigEnv) => {
  return defineConfig(defaultConfig(mode, command))
}
