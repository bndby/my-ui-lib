/**
 * Проверяет валидность email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Проверяет валидность российского телефона
 * Принимает форматы: +7XXXXXXXXXX, 8XXXXXXXXXX, 7XXXXXXXXXX
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "")
  return (
    (cleaned.length === 11 && (cleaned.startsWith("7") || cleaned.startsWith("8"))) ||
    cleaned.length === 10
  )
}

/**
 * Проверяет валидность URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Проверяет, что строка содержит только буквы (кириллица + латиница)
 */
export function isAlphabetic(str: string): boolean {
  return /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(str)
}

/**
 * Проверяет, что строка содержит только цифры
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str)
}

/**
 * Проверяет валидность ИНН (10 или 12 цифр)
 */
export function isValidInn(inn: string): boolean {
  const cleaned = inn.replace(/\D/g, "")
  
  if (cleaned.length !== 10 && cleaned.length !== 12) {
    return false
  }

  const checkDigit = (inn: string, coefficients: number[]): number => {
    let sum = 0
    for (let i = 0; i < coefficients.length; i++) {
      sum += parseInt(inn[i]) * coefficients[i]
    }
    return (sum % 11) % 10
  }

  if (cleaned.length === 10) {
    const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8]
    return checkDigit(cleaned, coefficients) === parseInt(cleaned[9])
  }

  if (cleaned.length === 12) {
    const coefficients1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
    const coefficients2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
    return (
      checkDigit(cleaned, coefficients1) === parseInt(cleaned[10]) &&
      checkDigit(cleaned, coefficients2) === parseInt(cleaned[11])
    )
  }

  return false
}

/**
 * Проверяет валидность СНИЛС (11 цифр)
 */
export function isValidSnils(snils: string): boolean {
  const cleaned = snils.replace(/\D/g, "")
  
  if (cleaned.length !== 11) {
    return false
  }

  const digits = cleaned.slice(0, 9)
  const checksum = parseInt(cleaned.slice(9, 11))

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (9 - i)
  }

  let controlNumber = 0
  if (sum < 100) {
    controlNumber = sum
  } else if (sum === 100 || sum === 101) {
    controlNumber = 0
  } else {
    controlNumber = sum % 101
    if (controlNumber === 100) {
      controlNumber = 0
    }
  }

  return controlNumber === checksum
}

/**
 * Проверяет минимальную длину строки
 */
export function hasMinLength(str: string, minLength: number): boolean {
  return str.length >= minLength
}

/**
 * Проверяет максимальную длину строки
 */
export function hasMaxLength(str: string, maxLength: number): boolean {
  return str.length <= maxLength
}

/**
 * Проверяет, что пароль достаточно надёжный
 * Требования: минимум 8 символов, цифра, заглавная и строчная буква
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false
  if (!/\d/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[A-Z]/.test(password)) return false
  return true
}

/**
 * Проверяет валидность даты
 */
export function isValidDate(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return !isNaN(dateObj.getTime())
}

/**
 * Проверяет, что дата в будущем
 */
export function isFutureDate(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.getTime() > Date.now()
}

/**
 * Проверяет, что дата в прошлом
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.getTime() < Date.now()
}
