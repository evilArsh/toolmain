// import typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup"
// import terser from "@rollup/plugin-terser"
import esbuild from "rollup-plugin-esbuild"
import dts from "rollup-plugin-dts"
import json from "@rollup/plugin-json"
export default defineConfig([
  {
    input: ["index.ts"],
    output: [
      {
        file: "index.mjs",
        format: "esm",
      },
    ],
    plugins: [esbuild(), json()],
    external: ["vue", /@vueuse\/.*/, "element-plus", /@toolman.*/],
  },
  {
    input: ["index.ts"],
    output: [
      {
        file: "index.d.mts",
      },
    ],
    plugins: [dts()],
    external: ["vue", /@vueuse\/.*/, "element-plus"],
  },
])
