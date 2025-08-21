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
  },
  // define: {},
  cacheDir: resolve(import.meta.dirname, "node_modules/.vite"),
  test: {
    reporters: "dot",
    coverage: {
      // enabled: true,
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
            instances: [{ browser: "chromium" }, { browser: "webkit" }],
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
              inline: ["vue", "msw"],
            },
          },
        },
      },
    ],
  },
})
