# my-ui-lib

Коллекция React компонентов, хуков и утилит, которые копируются прямо в ваш проект.

> ⚡ Код принадлежит вам — никаких внешних зависимостей, полный контроль над кодом!

## Установка

### Из npm (после публикации)

```bash
npm install -g my-ui-lib
# или
npx my-ui add button
```

### Из Git репозитория (без публикации в npm)

```bash
# Напрямую через npx + GitHub
npx github:YOUR_USERNAME/test-lib add button

# Или установить из git
npm install -g git+https://github.com/YOUR_USERNAME/test-lib.git
my-ui add button
```

### Локально (для разработки)

```bash
git clone https://github.com/YOUR_USERNAME/test-lib.git
cd test-lib
npm install && npm run build
npm link

# Теперь в любом проекте:
my-ui add button
```

## Быстрый старт

### 1. Инициализация (опционально)

```bash
my-ui init
```

Команда создаст файл `my-ui.config.json` с настройками путей:

```json
{
  "components": "src/components",
  "hooks": "src/hooks",
  "utils": "src/lib"
}
```

### 2. Просмотр доступных элементов

```bash
my-ui list
```

### 3. Добавление в проект

```bash
# Добавить конкретные элементы
my-ui add button card input

# Добавить с зависимостями автоматически
my-ui add modal  # автоматически добавит use-click-outside

# Интерактивный выбор
my-ui add

# Добавить всё
my-ui add --all

# Без подтверждения
my-ui add button -y
```

### 4. Информация об элементе

```bash
my-ui info button
```

## Содержимое

### UI Компоненты

| Компонент | Описание |
|-----------|----------|
| `button` | Кнопка с вариантами (primary, secondary, outline, ghost, danger) и размерами |
| `card` | Карточка с header, content и footer |
| `input` | Поле ввода с лейблом, ошибками и иконками |
| `modal` | Модальное окно с overlay и анимацией |

### Хуки

| Хук | Описание |
|-----|----------|
| `use-local-storage` | Работа с localStorage + синхронизация между вкладками |
| `use-debounce` | Debounce значений и callback-функций |
| `use-media-query` | Media queries + готовые брейкпоинты (isMobile, isDesktop) |
| `use-click-outside` | Отслеживание кликов вне элемента |
| `use-toggle` | Управление boolean состоянием |

### Утилиты

| Утилита | Описание |
|---------|----------|
| `cn` | Объединение CSS классов с условиями |
| `format` | Форматирование: даты, числа, валюта, телефоны, pluralize |
| `validators` | Валидация: email, телефон, ИНН, СНИЛС, пароли |
| `helpers` | Общие функции: debounce, throttle, groupBy, chunk, pick, omit |

## Пример использования

### Button

```tsx
import { Button } from "@/components/button"

<Button variant="primary" size="md">
  Отправить
</Button>

<Button variant="danger" isLoading>
  Удаление...
</Button>

<Button variant="outline" leftIcon={<PlusIcon />}>
  Добавить
</Button>
```

### Modal

```tsx
import { Modal, ModalFooter } from "@/components/modal"
import { Button } from "@/components/button"

const [isOpen, setIsOpen] = useState(false)

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Подтверждение">
  <p>Вы уверены, что хотите продолжить?</p>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Отмена
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Подтвердить
    </Button>
  </ModalFooter>
</Modal>
```

### useLocalStorage

```tsx
import { useLocalStorage } from "@/hooks/use-local-storage"

const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light")

// Значение автоматически синхронизируется между вкладками
setTheme("dark")
```

### format

```ts
import { formatCurrency, formatDate, pluralize, formatPhone } from "@/lib/format"

formatCurrency(1234.5) // "1 234,50 ₽"
formatDate(new Date(), "long") // "воскресенье, 15 января 2024 г."
pluralize(5, ["товар", "товара", "товаров"]) // "товаров"
formatPhone("79991234567") // "+7 (999) 123-45-67"
```

## Стилизация

Компоненты используют CSS Modules — стили изолированы и не конфликтуют с вашими.

### Кастомизация

После копирования в проект вы можете свободно менять:
- CSS переменные в `.module.css` файлах
- Структуру и логику в `.tsx` файлах
- Добавлять новые варианты и размеры

### Тёмная тема

Пример добавления тёмной темы в `button.module.css`:

```css
@media (prefers-color-scheme: dark) {
  .primary {
    background: #60a5fa;
  }

  .secondary {
    background: #374151;
    color: #f3f4f6;
  }
}
```

## Для разработчиков библиотеки

### Структура проекта

```
my-ui-lib/
├── src/cli/           # CLI утилита
│   └── cli.ts
├── registry/          # Исходный код компонентов
│   ├── ui/            # React компоненты + CSS
│   ├── hooks/         # React хуки
│   └── lib/           # Утилитарные функции
├── bin/               # Скомпилированный CLI (генерируется)
├── registry.json      # Манифест всех элементов
├── package.json
└── tsconfig.cli.json
```

### Сборка

```bash
npm install
npm run build
```

### Локальное тестирование

```bash
# Линк для глобального использования
npm link

# В другом проекте
my-ui add button
```

### Добавление новых элементов

Библиотека поддерживает три типа элементов:

- **Компоненты** (`ui/`) — React компоненты с CSS
- **Хуки** (`hooks/`) — React хуки
- **Утилиты** (`lib/`) — вспомогательные функции

---

#### Добавление UI компонента

**Шаг 1.** Создайте файлы компонента:

```
registry/ui/
├── avatar.tsx
└── avatar.module.css
```

**Шаг 2.** Напишите компонент (`registry/ui/avatar.tsx`):

```tsx
import * as React from "react"
import styles from "./avatar.module.css"
import { cn } from "@/lib/cn"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg"
  fallback?: string
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = "md", fallback, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    return (
      <div ref={ref} className={cn(styles.avatar, styles[size], className)} {...props}>
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            className={styles.image}
            onError={() => setHasError(true)}
          />
        ) : (
          <span className={styles.fallback}>
            {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
          </span>
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"
```

**Шаг 3.** Добавьте стили (`registry/ui/avatar.module.css`):

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;
}

.sm { width: 32px; height: 32px; font-size: 12px; }
.md { width: 40px; height: 40px; font-size: 14px; }
.lg { width: 56px; height: 56px; font-size: 18px; }

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fallback {
  color: #6b7280;
  font-weight: 500;
}
```

**Шаг 4.** Зарегистрируйте в `registry.json`:

```json
{
  "name": "avatar",
  "description": "Компонент аватара с fallback",
  "category": "ui",
  "files": ["ui/avatar.tsx", "ui/avatar.module.css"],
  "dependencies": ["cn"]
}
```

Добавьте в массив `items.components`.

---

#### Добавление хука

**Шаг 1.** Создайте файл хука (`registry/hooks/use-copy-to-clipboard.ts`):

```ts
import { useState, useCallback } from "react"

export function useCopyToClipboard(): [
  boolean,
  (text: string) => Promise<boolean>
] {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch {
      setCopied(false)
      return false
    }
  }, [])

  return [copied, copy]
}
```

**Шаг 2.** Зарегистрируйте в `registry.json`:

```json
{
  "name": "use-copy-to-clipboard",
  "description": "Хук для копирования текста в буфер обмена",
  "category": "hooks",
  "files": ["hooks/use-copy-to-clipboard.ts"],
  "dependencies": []
}
```

Добавьте в массив `items.hooks`.

---

#### Добавление утилиты

**Шаг 1.** Создайте файл (`registry/lib/array-utils.ts`):

```ts
/**
 * Возвращает случайный элемент массива
 */
export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Возвращает последний элемент массива
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

/**
 * Возвращает первый элемент массива
 */
export function first<T>(array: T[]): T | undefined {
  return array[0]
}
```

**Шаг 2.** Зарегистрируйте в `registry.json`:

```json
{
  "name": "array-utils",
  "description": "Утилиты для работы с массивами: sample, first, last",
  "category": "lib",
  "files": ["lib/array-utils.ts"],
  "dependencies": []
}
```

Добавьте в массив `items.utils`.

---

#### Зависимости между элементами

Если ваш элемент использует другие элементы библиотеки, укажите их в `dependencies`:

```json
{
  "name": "dropdown",
  "description": "Выпадающее меню",
  "category": "ui",
  "files": ["ui/dropdown.tsx", "ui/dropdown.module.css"],
  "dependencies": ["cn", "use-click-outside"]
}
```

При добавлении `dropdown` CLI автоматически добавит `cn` и `use-click-outside`.

---

#### Проверка и тестирование

```bash
# Пересобрать CLI
npm run build

# Проверить, что элемент появился в списке
node bin/cli.js list

# Посмотреть информацию
node bin/cli.js info avatar

# Протестировать добавление в тестовый проект
mkdir /tmp/test-project && cd /tmp/test-project
node /path/to/test-lib/bin/cli.js add avatar
```

---

#### Структура registry.json

```json
{
  "$schema": "./registry.schema.json",
  "name": "my-ui-lib",
  "version": "1.0.0",
  "items": {
    "components": [
      {
        "name": "button",           // Уникальное имя (используется в CLI)
        "description": "...",       // Описание (показывается в list)
        "category": "ui",           // Категория: ui | hooks | lib
        "files": ["ui/button.tsx"], // Файлы для копирования
        "dependencies": ["cn"]      // Зависимости из этой же библиотеки
      }
    ],
    "hooks": [ ... ],
    "utils": [ ... ]
  }
}
```

| Поле | Описание |
|------|----------|
| `name` | Уникальный идентификатор (kebab-case) |
| `description` | Краткое описание на русском |
| `category` | `ui` — компоненты, `hooks` — хуки, `lib` — утилиты |
| `files` | Массив путей относительно `registry/` |
| `dependencies` | Массив имён других элементов библиотеки |

## Публикация в npm

```bash
npm login
npm publish
```

После публикации пользователи смогут:

```bash
npx my-ui add button
# или
npm install -g my-ui-lib && my-ui add button
```

## Лицензия

MIT — используйте как хотите!
