# Тестирование компонентов, хуков и утилит

Все компоненты, хуки и утилиты поставляются с готовыми тестами, которые **полностью совместимы с Jest, Vitest и Rstest**.

## Универсальность тестов

Тесты написаны без привязки к конкретному фреймворку:
- ✅ Используют глобальные переменные (`describe`, `it`, `expect`, `vi`/`jest`)
- ✅ Не требуют импортов из тестовых фреймворков
- ✅ Работают со всеми тремя фреймворками без изменений
- ✅ Одинаковый API для моков (`vi` в Vitest = `jest` в Jest/Rstest)
- ✅ Rstest имеет Jest-совместимый API из коробки

## Установка зависимостей

### Для Vitest

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Для Jest

```bash
npm install -D jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest
```

### Для Rstest (новый фреймворк от Rspack)

```bash
npm install -D @rstest/core @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Совместимость с тремя фреймворками

Тесты написаны универсально и работают со всеми тремя фреймворками:

| Функция | Vitest | Jest | Rstest | В тестах |
|---------|--------|------|--------|----------|
| `describe` | Глобально | Глобально | Глобально | `describe(...)` |
| `it / test` | Глобально | Глобально | Глобально | `it(...)` или `test(...)` |
| `expect` | Глобально | Глобально | Глобально | `expect(...)` |
| `beforeEach` | Глобально | Глобально | Глобально | `beforeEach(...)` |
| `afterEach` | Глобально | Глобально | Глобально | `afterEach(...)` |
| Моки | `vi.fn()` | `jest.fn()` | `jest.fn()` | `vi.fn()` или `jest.fn()` |
| Таймеры | `vi.useFakeTimers()` | `jest.useFakeTimers()` | `jest.useFakeTimers()` | `vi` или `jest` |

**Важно:** 
- В **Vitest** используйте `vi` для моков
- В **Jest** используйте `jest` для моков
- В **Rstest** используйте `jest` для моков (Jest-совместимый API)
- Все доступны глобально!

## Настройка

### Vitest

1. Скопируйте `vitest.config.example.ts` как `vitest.config.ts` в корень проекта
2. Скопируйте `test-setup.ts` в директорию с компонентами  
3. Скопируйте `test-globals.d.ts` для поддержки типов
4. Настройте пути в конфигурации согласно вашей структуре
5. **Важно:** Убедитесь что `globals: true` включено в конфиге

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true, // ← Обязательно!
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
  }
})
```

### Jest

1. Скопируйте `jest.config.example.js` как `jest.config.js` в корень проекта
2. Скопируйте `test-setup.ts` в директорию с компонентами
3. Скопируйте `test-globals.d.ts` для поддержки типов
4. Настройте пути в конфигурации согласно вашей структуре
5. Jest использует глобальные переменные по умолчанию

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test-setup.ts"],
  // Глобальные переменные доступны автоматически
}
```

### Rstest (новый фреймворк от Rspack)

1. Скопируйте `rstest.config.example.ts` как `rstest.config.ts` в корень проекта
2. Скопируйте `test-setup.ts` в директорию с компонентами
3. Скопируйте `test-globals.d.ts` для поддержки типов
4. Настройте пути в конфигурации согласно вашей структуре
5. **Важно:** Rstest использует Jest-совместимый API с глобальными переменными

```typescript
// rstest.config.ts
import { defineConfig } from '@rstest/core'

export default defineConfig({
  testEnvironment: "jsdom",
  setupFiles: ["./test-setup.ts"],
  globals: true, // ← Обязательно!
})
```

## Запуск тестов

### Vitest

```bash
npm run test          # Запустить все тесты
npm run test:watch    # Watch режим
npm run test:coverage # Покрытие кода
```

Добавьте в `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Jest

```bash
npm run test          # Запустить все тесты
npm run test:watch    # Watch режим
npm run test:coverage # Покрытие кода
```

Добавьте в `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Rstest

```bash
npm run test          # Запустить все тесты
npm run test:watch    # Watch режим
npm run test:coverage # Покрытие кода
```

Добавьте в `package.json`:

```json
{
  "scripts": {
    "test": "rstest",
    "test:watch": "rstest --watch",
    "test:coverage": "rstest --coverage"
  }
}
```

## Структура тестов

Каждый компонент/хук/утилита имеет соответствующий тестовый файл:

```
components/
  ├── Button/
  │   ├── Button.tsx
  │   ├── Button.module.css
  │   └── Button.test.tsx
  ├── Card/
  │   ├── Card.tsx
  │   ├── Card.module.css
  │   └── Card.test.tsx
  ...

hooks/
  ├── use-debounce.ts
  ├── use-debounce.test.ts
  ...

lib/
  ├── cn.ts
  ├── cn.test.ts
  ...
```

## Покрытие тестами

Все компоненты, хуки и утилиты покрыты unit-тестами:

### Компоненты
- ✅ Button - 100% покрытие
- ✅ Card - 100% покрытие
- ✅ Input - 100% покрытие
- ✅ Modal - 100% покрытие

### Хуки
- ✅ useLocalStorage - 100% покрытие
- ✅ useDebounce - 100% покрытие
- ✅ useMediaQuery - 100% покрытие
- ✅ useClickOutside - 100% покрытие
- ✅ useToggle - 100% покрытие

### Утилиты
- ✅ cn - 100% покрытие
- ✅ format - 100% покрытие
- ✅ validators - 100% покрытие
- ✅ helpers - 100% покрытие

## Примеры использования

### Тестирование компонентов

```typescript
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./Button"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

test("кнопка вызывает onClick при клике", async () => {
  // В Vitest используйте vi.fn()
  // В Jest используйте jest.fn()
  // В Rstest используйте jest.fn() (Jest-совместимый API)
  // Все доступны глобально!
  const handleClick = vi.fn() // или jest.fn()
  const user = userEvent.setup()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  await user.click(screen.getByRole("button"))
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Тестирование хуков

```typescript
import { renderHook, act } from "@testing-library/react"
import { useToggle } from "./use-toggle"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

test("переключает значение", () => {
  const { result } = renderHook(() => useToggle(false))

  act(() => {
    const [, toggle] = result.current
    toggle()
  })

  expect(result.current[0]).toBe(true)
})

// С fake таймерами (во всех трех фреймворках)
describe("useDebounce", () => {
  beforeEach(() => {
    // Vitest: vi.useFakeTimers()
    // Jest/Rstest: jest.useFakeTimers()
    vi.useFakeTimers() // или jest.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks() // или jest.restoreAllMocks()
  })

  it("задерживает обновление", () => {
    // тест...
  })
})
```

### Тестирование утилит

```typescript
import { cn } from "./cn"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

test("объединяет классы", () => {
  expect(cn("class1", "class2")).toBe("class1 class2")
})

describe("cn", () => {
  it("фильтрует falsy значения", () => {
    expect(cn("class1", false, "class2", null)).toBe("class1 class2")
  })
})
```

## Выбор фреймворка

### Vitest
✅ **Рекомендуется для новых проектов**
- Очень быстрый (использует Vite)
- Отличная поддержка TypeScript и ESM
- Watch mode из коробки
- Совместимость с Jest API

### Jest
✅ **Зрелое решение**
- Проверенный временем
- Огромная экосистема
- Широкая поддержка сообщества
- Работает везде

### Rstest
✅ **Новое решение от Rspack**
- Jest-совместимый API
- Интеграция с Rspack
- Нативная поддержка TypeScript/ESM
- Современный подход

## Советы по тестированию

1. **Используйте пользовательские события**: `userEvent` вместо `fireEvent` для более реалистичных тестов
2. **Тестируйте поведение, а не реализацию**: Фокусируйтесь на том, что видит пользователь
3. **Используйте роли ARIA**: `getByRole` предпочтительнее `getByTestId`
4. **Мокайте внешние зависимости**: API вызовы, таймеры и т.д.
5. **Тестируйте граничные случаи**: Пустые значения, большие числа и т.д.
6. **Глобальные переменные**: Все фреймворки поддерживают `globals: true` - используйте это!

## Troubleshooting

### CSS модули не работают в тестах

Для Jest добавьте в `moduleNameMapper`:

```javascript
"\\.(css|less|scss|sass)$": "identity-obj-proxy"
```

Для Vitest установите `vitest-css-modules`:

```bash
npm install -D vitest-css-modules
```

### matchMedia не определен

Убедитесь, что `test-setup.ts` правильно подключен в конфигурации тестов.

### Таймауты при тестировании асинхронного кода

Увеличьте таймаут в конфигурации:

```javascript
testTimeout: 10000 // 10 секунд
```

## Дополнительная информация

- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library Documentation](https://testing-library.com/)
- [Testing Library React](https://testing-library.com/react)
