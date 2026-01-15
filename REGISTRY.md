# Registry — структура и правила

`registry.json` описывает все доступные шаблоны компонентов, хуков, утилит и тестовых конфигов.
Шаблоны располагаются в каталоге `templates/`.

## Структура

- `items.test-configs` — файлы конфигурации тестового окружения
- `items.components` — UI компоненты
- `items.hooks` — хуки
- `items.utils` — утилиты

Каждый элемент должен содержать:

```json
{
  "name": "ui/button",
  "description": "Краткое описание",
  "category": "ui",
  "files": ["ui/button/button.tsx", "ui/button/button.module.css"],
  "dependencies": [],
  "meta": { "since": "1.0.0" }
}
```

## Версионирование

`meta` используется для отслеживания изменений:

- `since` — версия, с которой элемент доступен
- `deprecated` — причина/версия депрекейта (опционально)
- `breaking` — описание breaking change (опционально)

## Валидация

Структура проверяется CLI на старте и описана в `registry.schema.json`.
