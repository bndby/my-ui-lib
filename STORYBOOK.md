# Storybook - Документация

## Запуск Storybook

Для запуска Storybook в режиме разработки:

```bash
npm run storybook
```

Storybook будет доступен по адресу: http://localhost:6006

## Сборка Storybook

Для создания статической сборки Storybook:

```bash
npm run build-storybook
```

Собранные файлы будут находиться в папке `storybook-static/`.

## Структура

### Конфигурация

- `.storybook/main.ts` - основная конфигурация Storybook
- `.storybook/preview.ts` - глобальные настройки отображения

### Stories

Все stories находятся рядом с соответствующими компонентами:

```
registry/
  ui/
    button/
      button.tsx
      button.module.css
      button.stories.tsx    # ← Stories для кнопки
    card/
      card.tsx
      card.module.css
      card.stories.tsx      # ← Stories для карточки
    ...
```

## Создание новых Stories

При добавлении нового компонента создайте файл `*.stories.tsx` в той же папке:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./your-component";

const meta = {
  title: "UI/YourComponent",
  component: YourComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // пропсы по умолчанию
  },
};
```

## Возможности Storybook

### Интерактивные контролы

В панели "Controls" вы можете изменять пропсы компонентов в реальном времени.

### Автодокументация

Благодаря тегу `"autodocs"` Storybook автоматически генерирует документацию на основе TypeScript типов.

### Тестирование

Каждую story можно открыть в отдельной вкладке для визуального тестирования:
- Нажмите на иконку "Open canvas in new tab" в панели инструментов

### Адаптивность

Используйте панель "Viewport" для тестирования компонентов на различных размерах экрана.

## Полезные ссылки

- [Документация Storybook](https://storybook.js.org/docs)
- [Аддоны Storybook](https://storybook.js.org/addons)
- [Storybook + Vite](https://storybook.js.org/docs/react/builders/vite)
