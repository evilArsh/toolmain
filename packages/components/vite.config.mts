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
        name: "ToolManComponents",
        formats: ["es"],
        fileName: "index",
      },
      rollupOptions: {
        external: ["vue", "@vueuse/core", /@toolman.*/],
        output: {
          globals: {
            vue: "Vue",
            "@vueuse/core": "VueUse",
          },
        },
      },
    },
    resolve: {
      alias: [
        { find: "@toolman/components", replacement: resolve(__dirname, "../../", "components") },
        { find: "@toolman/element", replacement: resolve(__dirname, "../../", "element") },
        { find: "@toolman/shared", replacement: resolve(__dirname, "../../", "shared") },
        { find: "@toolman/libs", replacement: resolve(__dirname, "../../", "libs") },
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
