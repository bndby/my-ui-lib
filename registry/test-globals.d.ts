/**
 * Глобальные типы для тестов
 * 
 * Этот файл обеспечивает совместимость типов для Jest, Vitest и Rstest
 * Позволяет использовать глобальные переменные без импортов
 */

/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

// Поддержка трех фреймворков:
// - Jest: использует jest.fn(), jest.mock()
// - Vitest: использует vi.fn(), vi.mock()
// - Rstest: использует jest-совместимый API (jest.fn(), jest.mock())
declare global {
  // В Jest глобальная переменная - jest
  // В Vitest глобальная переменная - vi
  // В Rstest глобальная переменная - jest (Jest-совместимый API)
  // Все три имеют одинаковый API для моков
  const vi: typeof import('vitest')['vi']
  const jest: typeof import('@jest/globals')['jest']
  
  // Общие функции доступны во всех фреймворках
  const describe: typeof import('vitest')['describe']
  const it: typeof import('vitest')['it']
  const test: typeof import('vitest')['test']
  const expect: typeof import('vitest')['expect']
  const beforeEach: typeof import('vitest')['beforeEach']
  const afterEach: typeof import('vitest')['afterEach']
  const beforeAll: typeof import('vitest')['beforeAll']
  const afterAll: typeof import('vitest')['afterAll']
}

export {}
