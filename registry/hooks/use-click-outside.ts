import { useEffect, useRef, type RefObject } from "react"

/**
 * Хук для отслеживания кликов вне элемента
 *
 * @param handler - Callback, вызываемый при клике вне элемента
 * @param enabled - Включить/выключить отслеживание (по умолчанию true)
 *
 * @example
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false)
 *   const ref = useClickOutside(() => setIsOpen(false), isOpen)
 *
 *   return (
 *     <div ref={ref}>
 *       {isOpen && <DropdownContent />}
 *     </div>
 *   )
 * }
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      // Проверяем, что клик был вне элемента
      if (ref.current && !ref.current.contains(target)) {
        handler(event)
      }
    }

    // Используем mousedown и touchstart для более быстрой реакции
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [handler, enabled])

  return ref
}

/**
 * Хук для отслеживания кликов вне нескольких элементов
 *
 * @param refs - Массив refs элементов, клики внутри которых игнорируются
 * @param handler - Callback, вызываемый при клике вне всех элементов
 * @param enabled - Включить/выключить отслеживание (по умолчанию true)
 *
 * @example
 * function Modal() {
 *   const modalRef = useRef(null)
 *   const buttonRef = useRef(null)
 *
 *   useClickOutsideMultiple(
 *     [modalRef, buttonRef],
 *     () => closeModal(),
 *     isOpen
 *   )
 *
 *   return (
 *     <>
 *       <button ref={buttonRef}>Открыть</button>
 *       <div ref={modalRef}>Модальное окно</div>
 *     </>
 *   )
 * }
 */
export function useClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      // Проверяем, что клик был вне всех элементов
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(target)
      )

      if (isOutside) {
        handler(event)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [refs, handler, enabled])
}
