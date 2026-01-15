#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import prompts from "prompts"
import { readFileSync } from "fs"
import { DEFAULT_CONFIG, loadConfig, saveConfig } from "./config"
import { copyFiles } from "./copy"
import { resolveDependencies } from "./deps"
import { PACKAGE_JSON_PATH } from "./paths"
import { findItem, getAllItems, loadRegistry } from "./registry"
import { checkTestSetup, offerTestSetup } from "./test-setup"
import { RegistryItem } from "./types"

// Версия из package.json
const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf-8"))
const VERSION = packageJson.version as string

// ========== КОМАНДЫ ==========

const program = new Command()

program
  .name("my-ui")
  .description("CLI для копирования компонентов, хуков и утилит в ваш проект")
  .version(VERSION)

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
      {
        type: "text",
        name: "tests",
        message: "Путь для тестовых конфигов:",
        initial: DEFAULT_CONFIG.tests,
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
      tests: response.tests,
    }

    saveConfig(config)
    console.log(chalk.green("\n✓ Конфигурация сохранена в my-ui.config.json"))
    
    // Предложить настроить тесты
    const registry = loadRegistry()
    const setupTests = await prompts({
      type: "confirm",
      name: "value",
      message: "Настроить тестовое окружение сейчас?",
      initial: true,
    })
    
    if (setupTests.value) {
      await offerTestSetup(registry, config)
    }
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

    // Проверяем, есть ли тесты в добавляемых элементах
    const hasTests = itemsWithDeps.some(item => 
      item.files.some(file => file.includes(".test."))
    )
    
    // Копируем файлы
    console.log(chalk.cyan("\n📁 Копирование файлов:\n"))

    for (const item of itemsWithDeps) {
      console.log(chalk.white(`${item.name}:`))
      copyFiles(item, config)
    }

    console.log(chalk.green("\n✓ Готово!\n"))
    
    // Если есть тесты, предложить настроить тестовое окружение
    if (hasTests) {
      await offerTestSetup(registry, config)
    }
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
    console.log(chalk.cyan("С версии:"), item.meta.since)
    if (item.meta.deprecated) {
      console.log(chalk.yellow("Deprecated:"), item.meta.deprecated)
    }
    if (item.meta.breaking) {
      console.log(chalk.red("Breaking:"), item.meta.breaking)
    }
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

// Команда: setup-tests
program
  .command("setup-tests")
  .description("Настроить тестовое окружение")
  .option("-f, --framework <framework>", "Выбрать фреймворк: vitest, jest, rstest, all")
  .option("-y, --yes", "Пропустить подтверждение")
  .action(async (options) => {
    const registry = loadRegistry()
    const config = loadConfig()
    
    const setup = checkTestSetup()
    
    if (setup.hasAnyConfig && setup.hasSetup && setup.hasGlobals) {
      console.log(chalk.green("\n✓ Тестовое окружение уже настроено!"))
      
      if (!options.yes) {
        const reinstall = await prompts({
          type: "confirm",
          name: "value",
          message: "Переустановить конфигурацию?",
          initial: false,
        })
        
        if (!reinstall.value) {
          return
        }
      }
    }
    
    let framework = options.framework
    
    if (!framework || !["vitest", "jest", "rstest", "all"].includes(framework)) {
      const response = await prompts({
        type: "select",
        name: "framework",
        message: "Выберите тестовый фреймворк:",
        choices: [
          { title: "Vitest (рекомендуется) — быстрый и современный", value: "vitest" },
          { title: "Jest — зрелое и надежное решение", value: "jest" },
          { title: "Rstest — новый от Rspack", value: "rstest" },
          { title: "Установить все три", value: "all" },
        ],
        initial: 0,
      })
      
      if (!response.framework) return
      framework = response.framework
    }
    
    console.log(chalk.cyan("\n📋 Установка тестовой конфигурации:\n"))
    
    const itemsToInstall: RegistryItem[] = []
    
    // Общие файлы
    const setupItem = findItem(registry, "test/setup")
    if (setupItem) itemsToInstall.push(setupItem)
    
    const globalsItem = findItem(registry, "test/globals")
    if (globalsItem) itemsToInstall.push(globalsItem)
    
    const cssModulesItem = findItem(registry, "test/css-modules")
    if (cssModulesItem) itemsToInstall.push(cssModulesItem)
    
    // Конфиги фреймворков
    if (framework === "all") {
      const vitestItem = findItem(registry, "test/vitest-config")
      const jestItem = findItem(registry, "test/jest-config")
      const rstestItem = findItem(registry, "test/rstest-config")
      if (vitestItem) itemsToInstall.push(vitestItem)
      if (jestItem) itemsToInstall.push(jestItem)
      if (rstestItem) itemsToInstall.push(rstestItem)
    } else {
      const configItem = findItem(registry, `test/${framework}-config`)
      if (configItem) itemsToInstall.push(configItem)
    }
    
    // Копируем файлы
    for (const item of itemsToInstall) {
      console.log(chalk.white(`${item.name}:`))
      copyFiles(item, config, true)
    }
    
    console.log(chalk.green("\n✓ Тестовое окружение настроено!"))
    
    // Инструкции
    console.log(chalk.cyan("\n📦 Установите необходимые зависимости:\n"))
    
    if (framework === "vitest" || framework === "all") {
      console.log(chalk.white("Для Vitest:"))
      console.log(chalk.gray("npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom\n"))
    }
    
    if (framework === "jest" || framework === "all") {
      console.log(chalk.white("Для Jest:"))
      console.log(chalk.gray("npm install -D jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest\n"))
    }
    
    if (framework === "rstest" || framework === "all") {
      console.log(chalk.white("Для Rstest:"))
      console.log(chalk.gray("npm install -D @rstest/core @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom\n"))
    }
  })

program.parse()
