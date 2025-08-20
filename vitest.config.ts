import { resolve } from "node:path"
import vue from "@vitejs/plugin-vue"
import { coverageConfigDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@toolmain/shared": resolve(import.meta.dirname, "packages/shared/index.ts"),
      "@toolmain/libs": resolve(import.meta.dirname, "packages/libs/index.ts"),
    },
    dedupe: ["vue", "@vue/runtime-core"],
  },
  define: {},
  cacheDir: resolve(import.meta.dirname, "node_modules/.vite"),
  test: {
    reporters: "dot",
    env: {
      TZ: "UTC-1", // to have some actual results with timezone offset
    },
    coverage: {
      exclude: [
        "packages/.vitepress/**",
        "playgrounds/**",
        "**/{unocss,taze}.config.ts",
        "scripts/**",
        ...coverageConfigDefaults.exclude,
      ],
    },

    clearMocks: true,
    projects: [
      "packages/*/vitest.config.ts",
      {
        // add "extends: true" to inherit the options from the root config
        extends: "./vitest.config.ts",
        resolve: {
          alias: {
            vue: "vue/dist/vue.esm-bundler.js",
          },
        },
        test: {
          include: ["packages/**/*.browser.{test,spec}.ts"],
          name: "browser",
          setupFiles: ["vitest-browser-vue"],
          browser: {
            enabled: true,
            provider: "playwright",
            headless: true,
            instances: [
              { browser: "chromium" },
              // { browser: 'firefox' }, // flaky FF test: https://github.com/vitest-dev/vitest/issues/7377
              { browser: "webkit" },
            ],
          },
        },
      },
      {
        extends: "./vitest.config.ts",
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: [resolve(import.meta.dirname, "packages/.test/setup.ts")],
          include: ["!packages/**/*.browser.{test,spec}.ts", "packages/**/*.{test,spec}.ts", "test/*.{test,spec}.ts"],
          server: {
            deps: {
              inline: ["vue", "msw", "vitest-package-exports"],
            },
          },
        },
      },
    ],
  },
  ssr: {
    noExternal: [/@vueuse\/.*/],
  },
})
