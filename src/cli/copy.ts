import chalk from "chalk"
import { cpSync, existsSync, mkdirSync } from "fs"
import { join } from "path"
import { getTargetDir } from "./config"
import { TEMPLATES_PATH } from "./paths"
import { Config, RegistryItem } from "./types"

export function copyFiles(
  item: RegistryItem,
  config: Config,
  overwrite: boolean = false
): void {
  const targetDir = join(process.cwd(), getTargetDir(config, item.category))

  // Создаём директорию, если не существует
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  for (const file of item.files) {
    const sourcePath = join(TEMPLATES_PATH, file)
    const fileParts = file.split("/")
    let fileName = fileParts.pop()!
    const relativeDir = fileParts.join("/")

    // Для тестовых конфигов убираем .example из имени
    if (item.category === "test" && fileName.includes(".example.")) {
      fileName = fileName.replace(".example.", ".")
    }

    const targetPath = join(targetDir, relativeDir, fileName)

    if (!existsSync(sourcePath)) {
      console.warn(chalk.yellow(`  ⚠ Файл не найден: ${file}`))
      continue
    }

    const targetFolder = join(targetDir, relativeDir)
    if (!existsSync(targetFolder)) {
      mkdirSync(targetFolder, { recursive: true })
    }

    if (existsSync(targetPath) && !overwrite) {
      console.log(chalk.yellow(`  ⚠ Файл уже существует: ${join(relativeDir, fileName)}`))
    } else {
      cpSync(sourcePath, targetPath)
      console.log(chalk.green(`  ✓ ${join(relativeDir, fileName)}`))
    }
  }
}
