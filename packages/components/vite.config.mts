import vue from "@vitejs/plugin-vue"
import Unocss from "unocss/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ConfigEnv, defineConfig, UserConfig } from "vite"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
const __dirname = dirname(fileURLToPath(import.meta.url))
// import { visualizer } from "rollup-plugin-visualizer"
const defaultConfig = (_mode: string, _command: string): UserConfig => {
  const config: UserConfig = {
    build: {
      lib: {
        entry: "./index.ts",
        name: "toolmainComponents",
        formats: ["es"],
        fileName: "index",
      },
      rollupOptions: {
        external: ["vue", "@vueuse/core", /@toolmain.*/, "vue-router", "element-plus", "pinia", "three"],
        output: {
          globals: {
            vue: "Vue",
            pinia: "Pinia",
            three: "THREE",
            "@vueuse/core": "VueUse",
            "vue-router": "VueRouter",
            "element-plus": "ElementPlus",
          },
        },
      },
    },
    resolve: {
      alias: [
        { find: "@toolmain/components", replacement: resolve(__dirname, "../../", "components") },
        { find: "@toolmain/shared", replacement: resolve(__dirname, "../../", "shared") },
        { find: "@toolmain/libs", replacement: resolve(__dirname, "../../", "libs") },
      ],
    },
    plugins: [
      vue(),
      vueJsx(),
      cssInjectedByJsPlugin(),
      Icons({}),
      Unocss(),
      AutoImport({
        vueTemplate: true,
        dts: false,
        resolvers: [IconsResolver()],
      }),
      Components({
        resolvers: [IconsResolver()],
        dts: false,
      }),
    ],
  }
  return config
}

export default ({ mode, command }: ConfigEnv) => {
  return defineConfig(defaultConfig(mode, command))
}
