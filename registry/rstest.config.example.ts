/**
 * Пример конфигурации Rstest для тестирования компонентов
 * 
 * Rstest - современный тестовый фреймворк от Rspack с Jest-совместимым API
 * Скопируйте этот файл в корень вашего проекта как rstest.config.ts
 */

import { defineConfig } from '@rstest/core'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Окружение для тестирования React компонентов
  testEnvironment: 'jsdom',
  
  // Setup файл с глобальными настройками
  setupFiles: ['./test-setup.ts'],
  
  // Плагины для поддержки React
  plugins: [react()],
  
  // Паттерны для поиска тестов
  testMatch: ['**/*.test.{ts,tsx}'],
  
  // Таймаут для тестов
  testTimeout: 10000,
  
  // Покрытие кода
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'dist/',
      '**/*.test.{ts,tsx}',
      '**/*.config.{ts,js}',
    ],
  },
  
  // Резолв путей (если используете алиасы)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Глобальные переменные (describe, it, expect доступны без импортов)
  globals: true,
})
