import chalk from "chalk"
import { readFileSync } from "fs"
import { REGISTRY_PATH } from "./paths"
import { Registry, RegistryItem } from "./types"

const ALLOWED_ITEM_CATEGORIES = new Set(["test", "ui", "hooks", "lib"])
const ROOT_KEYS = ["name", "version", "items"]
const ITEMS_KEYS = ["test-configs", "components", "hooks", "utils"]
const ITEM_KEYS = ["name", "description", "category", "files", "dependencies", "meta"]
const META_KEYS = ["since", "deprecated", "breaking"]

function fail(message: string): never {
  console.error(chalk.red(`Ошибка: ${message}`))
  process.exit(1)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function assertKeys(
  obj: Record<string, unknown>,
  allowed: string[],
  path: string,
  required: string[] = allowed
): void {
  for (const key of Object.keys(obj)) {
    if (!allowed.includes(key)) {
      fail(`registry.json: неожиданный ключ '${key}' в ${path}`)
    }
  }
  for (const key of required) {
    if (!(key in obj)) {
      fail(`registry.json: отсутствует ключ '${key}' в ${path}`)
    }
  }
}

function assertString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`registry.json: ${path} должен быть непустой строкой`)
  }
  return value
}

function assertStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) {
    fail(`registry.json: ${path} должен быть массивом строк`)
  }
  return value.map((item, index) => assertString(item, `${path}[${index}]`))
}

function assertArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    fail(`registry.json: ${path} должен быть массивом`)
  }
  return value
}

function validateMeta(value: unknown, path: string): RegistryItem["meta"] {
  if (!isRecord(value)) {
    fail(`registry.json: ${path} должен быть объектом`)
  }

  assertKeys(value, META_KEYS, path, ["since"])

  const since = assertString(value.since, `${path}.since`)
  const deprecated = value.deprecated
  const breaking = value.breaking

  if (deprecated !== undefined) {
    assertString(deprecated, `${path}.deprecated`)
  }
  if (breaking !== undefined) {
    assertString(breaking, `${path}.breaking`)
  }

  return {
    since,
    deprecated: deprecated as string | undefined,
    breaking: breaking as string | undefined,
  }
}

function validateRegistryItem(
  value: unknown,
  path: string,
  expectedCategory: string
): RegistryItem {
  if (!isRecord(value)) {
    fail(`registry.json: ${path} должен быть объектом`)
  }

  assertKeys(value, ITEM_KEYS, path)

  const name = assertString(value.name, `${path}.name`)
  const description = assertString(value.description, `${path}.description`)
  const category = assertString(value.category, `${path}.category`)
  const files = assertStringArray(value.files, `${path}.files`)
  const dependencies = assertStringArray(value.dependencies, `${path}.dependencies`)
  const meta = validateMeta(value.meta, `${path}.meta`)

  if (!ALLOWED_ITEM_CATEGORIES.has(category)) {
    fail(`registry.json: ${path}.category имеет недопустимое значение`)
  }
  if (category !== expectedCategory) {
    fail(`registry.json: ${path}.category должен быть '${expectedCategory}'`)
  }

  return {
    name,
    description,
    category,
    files,
    dependencies,
    meta,
  }
}

function validateRegistry(value: unknown): Registry {
  if (!isRecord(value)) {
    fail("registry.json: корень должен быть объектом")
  }

  assertKeys(value, ROOT_KEYS, "root")

  const name = assertString(value.name, "name")
  const version = assertString(value.version, "version")

  if (!isRecord(value.items)) {
    fail("registry.json: items должен быть объектом")
  }
  assertKeys(value.items, ITEMS_KEYS, "items")

  const testConfigs = assertArray(value.items["test-configs"], "items.test-configs")
  const components = assertArray(value.items.components, "items.components")
  const hooks = assertArray(value.items.hooks, "items.hooks")
  const utils = assertArray(value.items.utils, "items.utils")

  const normalizeItems = (
    rawItems: unknown[],
    expectedCategory: string,
    listPath: string
  ): RegistryItem[] => {
    return rawItems.map((item, index) =>
      validateRegistryItem(item, `${listPath}[${index}]`, expectedCategory)
    )
  }

  const parsedTestConfigs = normalizeItems(testConfigs, "test", "items.test-configs")
  const parsedComponents = normalizeItems(components, "ui", "items.components")
  const parsedHooks = normalizeItems(hooks, "hooks", "items.hooks")
  const parsedUtils = normalizeItems(utils, "lib", "items.utils")

  const allItems = [
    ...parsedTestConfigs,
    ...parsedComponents,
    ...parsedHooks,
    ...parsedUtils,
  ]
  const nameSet = new Set<string>()
  for (const item of allItems) {
    if (nameSet.has(item.name)) {
      fail(`registry.json: дублирующийся name '${item.name}'`)
    }
    nameSet.add(item.name)
  }

  for (const item of allItems) {
    for (const dep of item.dependencies) {
      if (!nameSet.has(dep)) {
        fail(`registry.json: зависимость '${dep}' не найдена (item: ${item.name})`)
      }
    }
  }

  return {
    name,
    version,
    items: {
      "test-configs": parsedTestConfigs,
      components: parsedComponents,
      hooks: parsedHooks,
      utils: parsedUtils,
    },
  }
}

export function loadRegistry(): Registry {
  try {
    const content = readFileSync(REGISTRY_PATH, "utf-8")
    const parsed = JSON.parse(content) as unknown
    return validateRegistry(parsed)
  } catch (error) {
    console.error(chalk.red("Ошибка: не удалось загрузить registry.json"))
    process.exit(1)
  }
}

export function getAllItems(
  registry: Registry,
  includeTestConfigs: boolean = false
): RegistryItem[] {
  const items = [
    ...registry.items.components,
    ...registry.items.hooks,
    ...registry.items.utils,
  ]

  if (includeTestConfigs) {
    items.push(...registry.items["test-configs"])
  }

  return items
}

export function findItem(registry: Registry, name: string): RegistryItem | undefined {
  return getAllItems(registry).find((item) => item.name === name)
}
