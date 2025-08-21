import { config } from "../eslint.config.mjs"
import tseslint, { Config } from "typescript-eslint"
import autoImport from "./.eslintrc-auto-import.json" assert { type: "json" }

const cnf: Config = tseslint.config(
  config.concat(
    {
      files: ["src/**/*.{js,mjs,cjs,ts,vue,jsx,tsx}"],
    },
    {
      languageOptions: autoImport,
    }
  )
)
export default cnf
