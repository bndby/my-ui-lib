# Тестирование компонентов, хуков и утилит

Все компоненты, хуки и утилиты поставляются с готовыми тестами, которые можно использовать в вашем проекте.

## Установка зависимостей

### Для Vitest (рекомендуется)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Для Jest

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest
```

## Настройка

### Vitest

1. Скопируйте `vitest.config.example.ts` как `vitest.config.ts` в корень проекта
2. Скопируйте `test-setup.ts` в директорию с компонентами
3. Настройте пути в конфигурации согласно вашей структуре

### Jest

1. Скопируйте `jest.config.example.js` как `jest.config.js` в корень проекта
2. Скопируйте `test-setup.ts` в директорию с компонентами
3. Настройте пути в конфигурации согласно вашей структуре

## Запуск тестов

### Vitest

```bash
# Запустить все тесты
npm run test

# Запустить в watch режиме
npm run test:watch

# Сгенерировать отчет о покрытии
npm run test:coverage
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
# Запустить все тесты
npm run test

# Запустить в watch режиме
npm run test:watch

# Сгенерировать отчет о покрытии
npm run test:coverage
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

test("кнопка вызывает onClick при клике", async () => {
  const handleClick = vi.fn() // или jest.fn() для Jest
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

test("переключает значение", () => {
  const { result } = renderHook(() => useToggle(false))

  act(() => {
    const [, toggle] = result.current
    toggle()
  })

  expect(result.current[0]).toBe(true)
})
```

### Тестирование утилит

```typescript
import { cn } from "./cn"

test("объединяет классы", () => {
  expect(cn("class1", "class2")).toBe("class1 class2")
})
```

## Советы по тестированию

1. **Используйте пользовательские события**: `userEvent` вместо `fireEvent` для более реалистичных тестов
2. **Тестируйте поведение, а не реализацию**: Фокусируйтесь на том, что видит пользователь
3. **Используйте роли ARIA**: `getByRole` предпочтительнее `getByTestId`
4. **Мокайте внешние зависимости**: API вызовы, таймеры и т.д.
5. **Тестируйте граничные случаи**: Пустые значения, большие числа и т.д.

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
