/**
 * Форматирует число как валюту
 * @example formatCurrency(1234.56, "RUB") // "1 234,56 ₽"
 */
export function formatCurrency(
  amount: number,
  currency: string = "RUB",
  locale: string = "ru-RU"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Форматирует число с разделителями тысяч
 * @example formatNumber(1234567) // "1 234 567"
 */
export function formatNumber(value: number, locale: string = "ru-RU"): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Форматирует дату
 * @example formatDate(new Date(), "long") // "15 января 2024 г."
 */
export function formatDate(
  date: Date | string | number,
  style: "short" | "medium" | "long" | "full" = "medium",
  locale: string = "ru-RU"
): string {
  const dateObj = typeof date === "object" ? date : new Date(date)

  const optionsMap: Record<typeof style, Intl.DateTimeFormatOptions> = {
    short: { day: "2-digit", month: "2-digit", year: "2-digit" },
    medium: { day: "numeric", month: "long", year: "numeric" },
    long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
    full: {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  }
  const options = optionsMap[style]

  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Форматирует относительное время
 * @example formatRelativeTime(Date.now() - 60000) // "1 минуту назад"
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = "ru-RU"
): string {
  const dateObj = typeof date === "object" ? date : new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second")
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute")
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour")
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day")
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month")
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year")
  }
}

/**
 * Форматирует размер файла
 * @example formatFileSize(1536) // "1.5 КБ"
 */
export function formatFileSize(bytes: number, locale: string = "ru-RU"): string {
  const units = ["Б", "КБ", "МБ", "ГБ", "ТБ"]
  let unitIndex = 0
  let size = bytes

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(size)} ${units[unitIndex]}`
}

/**
 * Форматирует телефонный номер (Россия)
 * @example formatPhone("79991234567") // "+7 (999) 123-45-67"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")

  if (
    cleaned.length === 11 &&
    (cleaned.startsWith("7") || cleaned.startsWith("8"))
  ) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`
  }

  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`
  }

  return phone
}

/**
 * Склоняет слово по числу
 * @example pluralize(5, ["яблоко", "яблока", "яблок"]) // "яблок"
 */
export function pluralize(
  count: number,
  words: [string, string, string]
): string {
  const absCount = Math.abs(count)
  const mod10 = absCount % 10
  const mod100 = absCount % 100

  if (mod100 >= 11 && mod100 <= 19) {
    return words[2]
  }

  if (mod10 === 1) {
    return words[0]
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return words[1]
  }

  return words[2]
}

/**
 * Обрезает текст до указанной длины с многоточием
 * @example truncate("Длинный текст", 10) // "Длинный..."
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix = "..."
): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length).trimEnd() + suffix
}

/**
 * Капитализирует первую букву
 * @example capitalize("привет") // "Привет"
 */
export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Форматирует имя (Фамилия И.О.)
 * @example formatName("Иван", "Петров", "Сергеевич") // "Петров И.С."
 */
export function formatName(
  firstName: string,
  lastName: string,
  middleName?: string
): string {
  const initials = middleName
    ? `${firstName.charAt(0)}.${middleName.charAt(0)}.`
    : `${firstName.charAt(0)}.`

  return `${lastName} ${initials}`
}
