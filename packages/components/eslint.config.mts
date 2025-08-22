import { config } from "../../eslint.config.mjs"
import tseslint, { Config } from "typescript-eslint"

const cnf: Config = tseslint.config(
  config.concat({
    files: ["**/*.{js,mjs,cjs,ts,vue,jsx,tsx}"],
  })
)
export default cnf
