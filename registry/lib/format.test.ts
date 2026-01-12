import { describe, it, expect } from "vitest"
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatPhone,
  formatFileSize,
  pluralize,
  truncate,
  capitalize,
  formatPercent,
} from "./format"

describe("formatCurrency", () => {
  it("форматирует рубли", () => {
    expect(formatCurrency(1234.56, "RUB")).toContain("1")
    expect(formatCurrency(1234.56, "RUB")).toContain("234")
  })

  it("форматирует доллары", () => {
    const result = formatCurrency(1234.56, "USD", "en-US")
    expect(result).toContain("$")
    expect(result).toContain("1,234")
  })

  it("обрабатывает ноль", () => {
    expect(formatCurrency(0, "RUB")).toBeTruthy()
  })

  it("обрабатывает отрицательные числа", () => {
    const result = formatCurrency(-1000, "RUB")
    expect(result).toContain("-")
  })
})

describe("formatNumber", () => {
  it("форматирует целые числа с разделителями", () => {
    const result = formatNumber(1234567)
    expect(result).toContain("1")
    expect(result).toContain("234")
    expect(result).toContain("567")
  })

  it("форматирует дробные числа", () => {
    expect(formatNumber(1234.56)).toBeTruthy()
  })

  it("обрабатывает ноль", () => {
    expect(formatNumber(0)).toBe("0")
  })
})

describe("formatDate", () => {
  it("форматирует дату в коротком формате", () => {
    const date = new Date("2024-01-15")
    const result = formatDate(date, "short")
    expect(result).toBeTruthy()
  })

  it("форматирует дату в среднем формате", () => {
    const date = new Date("2024-01-15")
    const result = formatDate(date, "medium")
    expect(result).toBeTruthy()
  })

  it("принимает строку даты", () => {
    const result = formatDate("2024-01-15", "short")
    expect(result).toBeTruthy()
  })

  it("принимает timestamp", () => {
    const result = formatDate(1705276800000, "short")
    expect(result).toBeTruthy()
  })
})

describe("formatTime", () => {
  it("форматирует время", () => {
    const date = new Date("2024-01-15T14:30:00")
    const result = formatTime(date)
    expect(result).toMatch(/\d{2}:\d{2}/)
  })

  it("включает секунды если указано", () => {
    const date = new Date("2024-01-15T14:30:45")
    const result = formatTime(date, true)
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/)
  })
})

describe("formatDateTime", () => {
  it("форматирует дату и время", () => {
    const date = new Date("2024-01-15T14:30:00")
    const result = formatDateTime(date)
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThan(10)
  })
})

describe("formatRelativeTime", () => {
  it("возвращает 'только что' для недавнего времени", () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe("только что")
  })

  it("форматирует минуты назад", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000) // 5 минут назад
    const result = formatRelativeTime(date)
    expect(result).toContain("минут")
  })

  it("форматирует часы назад", () => {
    const date = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 часа назад
    const result = formatRelativeTime(date)
    expect(result).toContain("час")
  })

  it("форматирует дни назад", () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 дня назад
    const result = formatRelativeTime(date)
    expect(result).toContain("дня")
  })

  it("возвращает полную дату для старых дат", () => {
    const date = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 дней назад
    const result = formatRelativeTime(date)
    expect(result).toBeTruthy()
  })
})

describe("formatPhone", () => {
  it("форматирует российский номер", () => {
    expect(formatPhone("79001234567")).toBe("+7 (900) 123-45-67")
  })

  it("форматирует номер с 8", () => {
    expect(formatPhone("89001234567")).toBe("+7 (900) 123-45-67")
  })

  it("форматирует номер с +7", () => {
    expect(formatPhone("+79001234567")).toBe("+7 (900) 123-45-67")
  })

  it("обрабатывает номер без кода страны", () => {
    expect(formatPhone("9001234567")).toBe("+7 (900) 123-45-67")
  })

  it("возвращает исходный номер если формат неизвестен", () => {
    expect(formatPhone("123")).toBe("123")
  })

  it("удаляет лишние символы", () => {
    expect(formatPhone("8 (900) 123-45-67")).toBe("+7 (900) 123-45-67")
  })
})

describe("formatFileSize", () => {
  it("форматирует байты", () => {
    expect(formatFileSize(500)).toBe("500 Б")
  })

  it("форматирует килобайты", () => {
    expect(formatFileSize(1024)).toBe("1 КБ")
  })

  it("форматирует мегабайты", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1 МБ")
  })

  it("форматирует гигабайты", () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 ГБ")
  })

  it("форматирует терабайты", () => {
    expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe("1 ТБ")
  })

  it("округляет до двух знаков", () => {
    expect(formatFileSize(1536)).toBe("1.5 КБ")
  })

  it("обрабатывает ноль", () => {
    expect(formatFileSize(0)).toBe("0 Б")
  })
})

describe("pluralize", () => {
  it("выбирает правильную форму для 1", () => {
    expect(pluralize(1, "яблоко", "яблока", "яблок")).toBe("яблоко")
  })

  it("выбирает правильную форму для 2-4", () => {
    expect(pluralize(2, "яблоко", "яблока", "яблок")).toBe("яблока")
    expect(pluralize(3, "яблоко", "яблока", "яблок")).toBe("яблока")
    expect(pluralize(4, "яблоко", "яблока", "яблок")).toBe("яблока")
  })

  it("выбирает правильную форму для 5+", () => {
    expect(pluralize(5, "яблоко", "яблока", "яблок")).toBe("яблок")
    expect(pluralize(10, "яблоко", "яблока", "яблок")).toBe("яблок")
  })

  it("работает с числами, оканчивающимися на 1 (кроме 11)", () => {
    expect(pluralize(21, "яблоко", "яблока", "яблок")).toBe("яблоко")
    expect(pluralize(11, "яблоко", "яблока", "яблок")).toBe("яблок")
  })

  it("работает с числами, оканчивающимися на 2-4 (кроме 12-14)", () => {
    expect(pluralize(22, "яблоко", "яблока", "яблок")).toBe("яблока")
    expect(pluralize(12, "яблоко", "яблока", "яблок")).toBe("яблок")
  })
})

describe("truncate", () => {
  it("обрезает длинный текст", () => {
    expect(truncate("Это очень длинный текст", 10)).toBe("Это очень...")
  })

  it("не обрезает короткий текст", () => {
    expect(truncate("Короткий", 10)).toBe("Короткий")
  })

  it("использует пользовательский суффикс", () => {
    expect(truncate("Длинный текст", 8, "…")).toBe("Длинный…")
  })

  it("обрабатывает пустую строку", () => {
    expect(truncate("", 10)).toBe("")
  })

  it("обрезает по границе слов если указано", () => {
    expect(truncate("Это длинный текст для теста", 15, "...", true)).toBe("Это длинный...")
  })
})

describe("capitalize", () => {
  it("делает первую букву заглавной", () => {
    expect(capitalize("hello")).toBe("Hello")
  })

  it("делает остальные буквы строчными", () => {
    expect(capitalize("hELLO")).toBe("Hello")
  })

  it("обрабатывает пустую строку", () => {
    expect(capitalize("")).toBe("")
  })

  it("обрабатывает строку из одной буквы", () => {
    expect(capitalize("a")).toBe("A")
  })

  it("работает с кириллицей", () => {
    expect(capitalize("привет")).toBe("Привет")
  })
})

describe("formatPercent", () => {
  it("форматирует проценты", () => {
    expect(formatPercent(0.5)).toBe("50%")
  })

  it("форматирует с заданной точностью", () => {
    expect(formatPercent(0.12345, 2)).toBe("12.35%")
  })

  it("обрабатывает ноль", () => {
    expect(formatPercent(0)).toBe("0%")
  })

  it("обрабатывает единицу", () => {
    expect(formatPercent(1)).toBe("100%")
  })

  it("обрабатывает значения больше 1", () => {
    expect(formatPercent(1.5)).toBe("150%")
  })
})
