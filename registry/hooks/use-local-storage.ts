import { useState, useEffect, useCallback } from "react"

/**
 * Хук для работы с localStorage с автоматической синхронизацией между вкладками
 *
 * @param key - Ключ в localStorage
 * @param initialValue - Начальное значение, если ключа нет в storage
 *
 * @example
 * const [theme, setTheme] = useLocalStorage("theme", "light")
 * setTheme("dark")
 *
 * @example
 * const [user, setUser] = useLocalStorage<User | null>("user", null)
 * setUser({ name: "John" })
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Получаем начальное значение
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Ошибка чтения localStorage ключа "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Сохраняем значение в localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (typeof window === "undefined") {
        console.warn(`Попытка использовать localStorage на сервере для ключа "${key}"`)
        return
      }

      try {
        // Используем функциональное обновление для получения актуального значения
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          
          // Отправляем кастомное событие для синхронизации между хуками
          window.dispatchEvent(new StorageEvent("storage", { key }))
          
          return valueToStore
        })
      } catch (error) {
        console.warn(`Ошибка записи в localStorage ключа "${key}":`, error)
      }
    },
    [key]
  )

  // Удаляем значение из localStorage
  const removeValue = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
      window.dispatchEvent(new StorageEvent("storage", { key }))
    } catch (error) {
      console.warn(`Ошибка удаления из localStorage ключа "${key}":`, error)
    }
  }, [key, initialValue])

  // Синхронизация между вкладками и хуками
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(readValue())
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key, readValue])

  return [storedValue, setValue, removeValue]
}
