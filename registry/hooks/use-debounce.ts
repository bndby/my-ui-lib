import { useState, useEffect } from "react"

/**
 * Хук для debounce значения
 * Возвращает значение, которое обновляется только после паузы в изменениях
 *
 * @param value - Значение для debounce
 * @param delay - Задержка в миллисекундах (по умолчанию 500)
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState("")
 * const debouncedQuery = useDebounce(searchQuery, 300)
 *
 * useEffect(() => {
 *   // Запрос выполняется только после 300мс паузы в наборе
 *   fetchResults(debouncedQuery)
 * }, [debouncedQuery])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Хук для создания debounced callback функции
 *
 * @param callback - Функция для debounce
 * @param delay - Задержка в миллисекундах (по умолчанию 500)
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   api.search(query)
 * }, 300)
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number = 500
): T {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }) as T

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return debouncedCallback
}
