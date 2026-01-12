import { useState, useEffect, useRef, useCallback } from "react"

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
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 500
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(callback)

  // Обновляем callback ref при каждом рендере
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const debouncedCallback = useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }) as T,
    [delay]
  )

  return debouncedCallback
}
