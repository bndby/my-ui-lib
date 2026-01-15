import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { Config } from "./types"

export const DEFAULT_CONFIG: Config = {
  components: "src/components",
  hooks: "src/hooks",
  utils: "src/lib",
  tests: ".",
}

export function loadConfig(): Config {
  const configPath = join(process.cwd(), "my-ui.config.json")
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, "utf-8")
      return { ...DEFAULT_CONFIG, ...JSON.parse(content) }
    } catch {
      return DEFAULT_CONFIG
    }
  }
  return DEFAULT_CONFIG
}

export function saveConfig(config: Config): void {
  const configPath = join(process.cwd(), "my-ui.config.json")
  writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export function getTargetDir(config: Config, category: string): string {
  switch (category) {
    case "ui":
      return config.components
    case "hooks":
      return config.hooks
    case "lib":
      return config.utils
    case "test":
      return config.tests
    default:
      return config.components
  }
}
