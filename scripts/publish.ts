import { execSync } from "node:child_process"

const command = "pnpm publish -r --access public --no-git-checks --registry https://registry.npmjs.org/"
execSync(command, { stdio: "inherit" })
