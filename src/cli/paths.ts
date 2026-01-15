import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const PACKAGE_ROOT = join(__dirname, "..")
export const PACKAGE_JSON_PATH = join(PACKAGE_ROOT, "package.json")
export const REGISTRY_PATH = join(PACKAGE_ROOT, "registry.json")
export const TEMPLATES_PATH = join(PACKAGE_ROOT, "templates")
