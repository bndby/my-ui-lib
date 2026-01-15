import chalk from "chalk"
import prompts from "prompts"
import { existsSync } from "fs"
import { join } from "path"
import { Config, Registry, RegistryItem } from "./types"
import { copyFiles } from "./copy"
import { findItem } from "./registry"

// Проверка установлены ли тестовые конфиги
export function checkTestSetup(): {
  hasAnyConfig: boolean
  hasVitest: boolean
  hasJest: boolean
  hasRstest: boolean
  hasSetup: boolean
  hasGlobals: boolean
} {
  const cwd = process.cwd()

  return {
    hasVitest:
      existsSync(join(cwd, "vitest.config.ts")) ||
      existsSync(join(cwd, "vitest.config.js")),
    hasJest:
      existsSync(join(cwd, "jest.config.ts")) ||
      existsSync(join(cwd, "jest.config.js")),
    hasRstest:
      existsSync(join(cwd, "rstest.config.ts")) ||
      existsSync(join(cwd, "rstest.config.js")),
    hasSetup:
      existsSync(join(cwd, "test-setup.ts")) ||
      existsSync(join(cwd, "test-setup.js")),
    hasGlobals: existsSync(join(cwd, "test-globals.d.ts")),
    get hasAnyConfig() {
      return this.hasVitest || this.hasJest || this.hasRstest
    },
  }
}

// Предложить установить тестовую конфигурацию
export async function offerTestSetup(
  registry: Registry,
  config: Config
): Promise<void> {
  const setup = checkTestSetup()

  if (setup.hasAnyConfig && setup.hasSetup && setup.hasGlobals) {
    return // Все уже установлено
  }

  console.log(chalk.cyan("\n🧪 Обнаружены тесты, но тестовое окружение не настроено\n"))

  const response = await prompts({
    type: "confirm",
    name: "value",
    message: "Установить конфигурацию для тестирования?",
    initial: true,
  })

  if (!response.value) {
    console.log(
      chalk.yellow(
        "Пропущено. Используйте 'my-ui setup-tests' для настройки позже.\n"
      )
    )
    return
  }

  // Выбор тестового фреймворка
  const frameworkChoice = await prompts({
    type: "select",
    name: "framework",
    message: "Выберите тестовый фреймворк:",
    choices: [
      { title: "Vitest (рекомендуется) — быстрый и современный", value: "vitest" },
      { title: "Jest — зрелое и надежное решение", value: "jest" },
      { title: "Rstest — новый от Rspack", value: "rstest" },
      { title: "Установить все три (можно выбрать потом)", value: "all" },
    ],
    initial: 0,
  })

  if (!frameworkChoice.framework) return

  console.log(chalk.cyan("\n📋 Установка тестовой конфигурации:\n"))

  const itemsToInstall: RegistryItem[] = []

  // Общие файлы (всегда нужны)
  if (!setup.hasSetup) {
    const setupItem = findItem(registry, "test/setup")
    if (setupItem) itemsToInstall.push(setupItem)
  }

  if (!setup.hasGlobals) {
    const globalsItem = findItem(registry, "test/globals")
    if (globalsItem) itemsToInstall.push(globalsItem)
  }

  const cssModulesItem = findItem(registry, "test/css-modules")
  if (cssModulesItem) itemsToInstall.push(cssModulesItem)

  // Конфиги фреймворков
  if (frameworkChoice.framework === "all") {
    if (!setup.hasVitest) {
      const vitestItem = findItem(registry, "test/vitest-config")
      if (vitestItem) itemsToInstall.push(vitestItem)
    }
    if (!setup.hasJest) {
      const jestItem = findItem(registry, "test/jest-config")
      if (jestItem) itemsToInstall.push(jestItem)
    }
    if (!setup.hasRstest) {
      const rstestItem = findItem(registry, "test/rstest-config")
      if (rstestItem) itemsToInstall.push(rstestItem)
    }
  } else {
    const configName = `test/${frameworkChoice.framework}-config`
    const configItem = findItem(registry, configName)
    if (configItem) itemsToInstall.push(configItem)
  }

  // Копируем файлы
  for (const item of itemsToInstall) {
    console.log(chalk.white(`${item.name}:`))
    copyFiles(item, config)
  }

  console.log(chalk.green("\n✓ Тестовое окружение настроено!"))

  // Инструкции по установке зависимостей
  console.log(chalk.cyan("\n📦 Установите необходимые зависимости:\n"))

  if (frameworkChoice.framework === "vitest" || frameworkChoice.framework === "all") {
    console.log(chalk.white("Для Vitest:"))
    console.log(
      chalk.gray(
        "npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom\n"
      )
    )
  }

  if (frameworkChoice.framework === "jest" || frameworkChoice.framework === "all") {
    console.log(chalk.white("Для Jest:"))
    console.log(
      chalk.gray(
        "npm install -D jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest\n"
      )
    )
  }

  if (frameworkChoice.framework === "rstest" || frameworkChoice.framework === "all") {
    console.log(chalk.white("Для Rstest:"))
    console.log(
      chalk.gray(
        "npm install -D @rstest/core @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom\n"
      )
    )
  }
}
