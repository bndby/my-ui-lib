#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import prompts from "prompts"
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from "fs"
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Путь к registry (относительно bin/)
const REGISTRY_PATH = join(__dirname, "..", "registry.json")
const COMPONENTS_PATH = join(__dirname, "..", "registry")

interface RegistryItem {
  name: string
  description: string
  category: string
  files: string[]
  dependencies: string[]
}

interface Registry {
  name: string
  version: string
  items: {
    components: RegistryItem[]
    hooks: RegistryItem[]
    utils: RegistryItem[]
  }
}

interface Config {
  components: string
  hooks: string
  utils: string
}

const DEFAULT_CONFIG: Config = {
  components: "src/components",
  hooks: "src/hooks",
  utils: "src/lib",
}

function loadRegistry(): Registry {
  try {
    const content = readFileSync(REGISTRY_PATH, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    console.error(chalk.red("Ошибка: не удалось загрузить registry.json"))
    process.exit(1)
  }
}

function loadConfig(): Config {
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

function saveConfig(config: Config): void {
  const configPath = join(process.cwd(), "my-ui.config.json")
  writeFileSync(configPath, JSON.stringify(config, null, 2))
}

function getAllItems(registry: Registry): RegistryItem[] {
  return [
    ...registry.items.components,
    ...registry.items.hooks,
    ...registry.items.utils,
  ]
}

function findItem(registry: Registry, name: string): RegistryItem | undefined {
  return getAllItems(registry).find((item) => item.name === name)
}

function getTargetDir(config: Config, category: string): string {
  switch (category) {
    case "ui":
      return config.components
    case "hooks":
      return config.hooks
    case "lib":
      return config.utils
    default:
      return config.components
  }
}

function copyFiles(item: RegistryItem, config: Config): void {
  const targetDir = join(process.cwd(), getTargetDir(config, item.category))

  // Создаём директорию, если не существует
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  for (const file of item.files) {
    const sourcePath = join(COMPONENTS_PATH, file)
    const fileName = file.split("/").pop()!
    const targetPath = join(targetDir, fileName)

    if (!existsSync(sourcePath)) {
      console.warn(chalk.yellow(`  ⚠ Файл не найден: ${file}`))
      continue
    }

    if (existsSync(targetPath)) {
      console.log(chalk.yellow(`  ⚠ Файл уже существует: ${fileName}`))
    } else {
      cpSync(sourcePath, targetPath)
      console.log(chalk.green(`  ✓ ${fileName}`))
    }
  }
}

function resolveDependencies(
  registry: Registry,
  item: RegistryItem,
  resolved: Set<string> = new Set()
): RegistryItem[] {
  const deps: RegistryItem[] = []

  for (const depName of item.dependencies) {
    if (resolved.has(depName)) continue
    resolved.add(depName)

    const dep = findItem(registry, depName)
    if (dep) {
      deps.push(...resolveDependencies(registry, dep, resolved))
      deps.push(dep)
    }
  }

  return deps
}

// ========== КОМАНДЫ ==========

const program = new Command()

program
  .name("my-ui")
  .description("CLI для копирования компонентов, хуков и утилит в ваш проект")
  .version("1.0.0")

// Команда: init
program
  .command("init")
  .description("Инициализировать конфигурацию в текущем проекте")
  .action(async () => {
    console.log(chalk.cyan("\n🔧 Настройка my-ui-lib\n"))

    const response = await prompts([
      {
        type: "text",
        name: "components",
        message: "Путь для компонентов:",
        initial: DEFAULT_CONFIG.components,
      },
      {
        type: "text",
        name: "hooks",
        message: "Путь для хуков:",
        initial: DEFAULT_CONFIG.hooks,
      },
      {
        type: "text",
        name: "utils",
        message: "Путь для утилит:",
        initial: DEFAULT_CONFIG.utils,
      },
    ])

    if (!response.components) {
      console.log(chalk.yellow("\nОтменено."))
      return
    }

    const config: Config = {
      components: response.components,
      hooks: response.hooks,
      utils: response.utils,
    }

    saveConfig(config)
    console.log(chalk.green("\n✓ Конфигурация сохранена в my-ui.config.json"))
  })

// Команда: list
program
  .command("list")
  .alias("ls")
  .description("Показать список доступных элементов")
  .option("-c, --components", "Только компоненты")
  .option("-h, --hooks", "Только хуки")
  .option("-u, --utils", "Только утилиты")
  .action((options) => {
    const registry = loadRegistry()

    console.log(chalk.cyan(`\n📦 ${registry.name} v${registry.version}\n`))

    const showAll = !options.components && !options.hooks && !options.utils

    if (showAll || options.components) {
      console.log(chalk.bold.white("Компоненты:"))
      for (const item of registry.items.components) {
        console.log(`  ${chalk.green(item.name)} — ${chalk.gray(item.description)}`)
      }
      console.log()
    }

    if (showAll || options.hooks) {
      console.log(chalk.bold.white("Хуки:"))
      for (const item of registry.items.hooks) {
        console.log(`  ${chalk.blue(item.name)} — ${chalk.gray(item.description)}`)
      }
      console.log()
    }

    if (showAll || options.utils) {
      console.log(chalk.bold.white("Утилиты:"))
      for (const item of registry.items.utils) {
        console.log(`  ${chalk.yellow(item.name)} — ${chalk.gray(item.description)}`)
      }
      console.log()
    }
  })

// Команда: add
program
  .command("add [items...]")
  .description("Добавить компоненты, хуки или утилиты в проект")
  .option("-y, --yes", "Пропустить подтверждение")
  .option("-a, --all", "Добавить все элементы")
  .action(async (items: string[], options) => {
    const registry = loadRegistry()
    const config = loadConfig()

    let selectedItems: RegistryItem[] = []

    if (options.all) {
      selectedItems = getAllItems(registry)
    } else if (items.length > 0) {
      for (const name of items) {
        const item = findItem(registry, name)
        if (item) {
          selectedItems.push(item)
        } else {
          console.warn(chalk.yellow(`⚠ Элемент не найден: ${name}`))
        }
      }
    } else {
      // Интерактивный выбор
      const allItems = getAllItems(registry)
      const response = await prompts({
        type: "multiselect",
        name: "selected",
        message: "Выберите элементы для добавления:",
        choices: allItems.map((item) => ({
          title: `${item.name} — ${item.description}`,
          value: item.name,
        })),
        hint: "Пробел — выбрать, Enter — подтвердить",
      })

      if (!response.selected || response.selected.length === 0) {
        console.log(chalk.yellow("\nНичего не выбрано."))
        return
      }

      for (const name of response.selected) {
        const item = findItem(registry, name)
        if (item) selectedItems.push(item)
      }
    }

    if (selectedItems.length === 0) {
      console.log(chalk.yellow("Нет элементов для добавления."))
      return
    }

    // Собираем зависимости
    const allDeps = new Set<string>()
    const itemsWithDeps: RegistryItem[] = []

    for (const item of selectedItems) {
      const deps = resolveDependencies(registry, item, allDeps)
      for (const dep of deps) {
        if (!itemsWithDeps.find((i) => i.name === dep.name)) {
          itemsWithDeps.push(dep)
        }
      }
      if (!itemsWithDeps.find((i) => i.name === item.name)) {
        itemsWithDeps.push(item)
      }
    }

    // Показываем что будет добавлено
    console.log(chalk.cyan("\n📋 Будет добавлено:\n"))
    for (const item of itemsWithDeps) {
      const isDep = !selectedItems.find((i) => i.name === item.name)
      const label = isDep ? chalk.gray("(зависимость)") : ""
      console.log(`  ${chalk.green("•")} ${item.name} ${label}`)
    }

    // Подтверждение
    if (!options.yes) {
      const confirm = await prompts({
        type: "confirm",
        name: "value",
        message: "Продолжить?",
        initial: true,
      })

      if (!confirm.value) {
        console.log(chalk.yellow("\nОтменено."))
        return
      }
    }

    // Копируем файлы
    console.log(chalk.cyan("\n📁 Копирование файлов:\n"))

    for (const item of itemsWithDeps) {
      console.log(chalk.white(`${item.name}:`))
      copyFiles(item, config)
    }

    console.log(chalk.green("\n✓ Готово!\n"))
  })

// Команда: info
program
  .command("info <name>")
  .description("Показать информацию об элементе")
  .action((name: string) => {
    const registry = loadRegistry()
    const item = findItem(registry, name)

    if (!item) {
      console.log(chalk.red(`\nЭлемент не найден: ${name}`))
      return
    }

    console.log()
    console.log(chalk.bold.white(item.name))
    console.log(chalk.gray(item.description))
    console.log()
    console.log(chalk.cyan("Категория:"), item.category)
    console.log(chalk.cyan("Файлы:"))
    for (const file of item.files) {
      console.log(`  • ${file}`)
    }
    if (item.dependencies.length > 0) {
      console.log(chalk.cyan("Зависимости:"))
      for (const dep of item.dependencies) {
        console.log(`  • ${dep}`)
      }
    }
    console.log()
  })

program.parse()
