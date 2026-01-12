/**
 * Пример конфигурации Vitest для тестирования компонентов
 * 
 * Скопируйте этот файл в корень вашего проекта как vitest.config.ts
 * и настройте пути согласно вашей структуре проекта
 */

import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    // Окружение для тестирования React компонентов
    environment: "jsdom",
    
    // Setup файл с глобальными настройками
    setupFiles: ["./test-setup.ts"],
    
    // Глобальные переменные тестов
    globals: true,
    
    // Покрытие кода
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,js}",
      ],
    },
    
    // Паттерны для поиска тестов
    include: ["**/*.test.{ts,tsx}"],
    
    // Таймаут для тестов
    testTimeout: 10000,
  },
  
  // Резолв путей (если используете алиасы)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
