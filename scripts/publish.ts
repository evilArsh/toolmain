import { execSync } from "node:child_process"

const command = "pnpm publish -r --access public --no-git-checks --dry-run"
execSync(command, { stdio: "inherit" })

