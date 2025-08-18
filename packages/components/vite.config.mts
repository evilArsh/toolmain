import path, { dirname } from "node:path"
import vue from "@vitejs/plugin-vue"
import Unocss from "unocss/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ConfigEnv, defineConfig, UserConfig } from "vite"
import { fileURLToPath } from "node:url"
const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultConfig = (_mode: string, _command: string): UserConfig => {
  const config: UserConfig = {
    build: {
      lib: {
        entry: path.resolve(__dirname, "index.ts"),
        name: "@toolman/components",
      },
      rollupOptions: {
        external: ["vue", "@vueuse/core"],
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
        { find: "@toolman/libs", replacement: path.resolve("../../", "packages/libs/index.ts") },
        { find: "@toolman/shared", replacement: path.resolve("../../", "packages/shared/index.ts") },
      ],
    },
    plugins: [
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
        vueTemplate: true,
        dts: false,
        // eslintrc: {
        //   enabled: true,
        //   filepath: "./.eslintrc-auto-import.json",
        // },
        resolvers: [IconsResolver()],
      }),
      Components({
        resolvers: [IconsResolver()],
        dts: true,
      }),
    ],
  }
  return config
}

export default ({ mode, command }: ConfigEnv) => {
  return defineConfig(defaultConfig(mode, command))
}
