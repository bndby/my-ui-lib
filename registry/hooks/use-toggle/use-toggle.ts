import { useState, useCallback } from "react"

/**
 * Хук для управления boolean состоянием
 *
 * @param initialValue - Начальное значение (по умолчанию false)
 *
 * @example
 * const [isOpen, toggle, setIsOpen] = useToggle()
 *
 * <button onClick={toggle}>Переключить</button>
 * <button onClick={() => setIsOpen(true)}>Открыть</button>
 *
 * @example
 * const [isEnabled, toggleEnabled] = useToggle(true)
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return [value, toggle, setValue]
}
