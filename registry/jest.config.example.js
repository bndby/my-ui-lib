/**
 * Пример конфигурации Jest для тестирования компонентов
 * 
 * Скопируйте этот файл в корень вашего проекта как jest.config.js
 * и настройте пути согласно вашей структуре проекта
 */

module.exports = {
  // Окружение для тестирования
  testEnvironment: "jsdom",

  // Setup файл с глобальными настройками
  setupFilesAfterEnv: ["<rootDir>/test-setup.ts"],

  // Jest использует глобальные переменные по умолчанию
  // describe, it, expect, beforeEach, afterEach доступны без импортов

  // Трансформация файлов
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: {
        jsx: "react-jsx",
      },
    }],
  },

  // Паттерны для поиска тестов
  testMatch: [
    "**/*.test.(ts|tsx)",
  ],

  // Игнорируемые директории
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],

  // Модули, которые не нужно трансформировать
  transformIgnorePatterns: [
    "/node_modules/",
  ],

  // Маппинг модулей (если используете алиасы)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // Покрытие кода
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.d.ts",
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Таймаут для тестов
  testTimeout: 10000,
}
