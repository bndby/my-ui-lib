import { useState, useEffect } from "react"

/**
 * Хук для отслеживания media query
 *
 * @param query - CSS media query строка
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)")
 * const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
 *
 * if (isMobile) {
 *   return <MobileLayout />
 * }
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia(query)
    
    // Устанавливаем начальное значение
    setMatches(mediaQuery.matches)

    // Обработчик изменений
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Подписываемся на изменения
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

/**
 * Предустановленные брейкпоинты (соответствуют Tailwind CSS)
 */
export function useBreakpoints() {
  const isSm = useMediaQuery("(min-width: 640px)")
  const isMd = useMediaQuery("(min-width: 768px)")
  const isLg = useMediaQuery("(min-width: 1024px)")
  const isXl = useMediaQuery("(min-width: 1280px)")
  const is2xl = useMediaQuery("(min-width: 1536px)")

  return {
    /** >= 640px */
    isSm,
    /** >= 768px */
    isMd,
    /** >= 1024px */
    isLg,
    /** >= 1280px */
    isXl,
    /** >= 1536px */
    is2xl,
    /** < 768px (мобильные устройства) */
    isMobile: !isMd,
    /** >= 768px && < 1024px (планшеты) */
    isTablet: isMd && !isLg,
    /** >= 1024px (десктоп) */
    isDesktop: isLg,
  }
}

/**
 * Хук для определения предпочтения тёмной темы
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)")
}

/**
 * Хук для определения предпочтения уменьшенной анимации
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}
