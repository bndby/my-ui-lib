import { renderHook, act } from "@testing-library/react"
import { useMediaQuery, useBreakpoints, usePrefersDarkMode, usePrefersReducedMotion } from "./use-media-query"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

// Мок для matchMedia
const createMatchMediaMock = (matches: boolean) => {
  const listeners: ((event: MediaQueryListEvent) => void)[] = []

  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
      if (event === "change") {
        listeners.push(handler)
      }
    }),
    removeEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
      const index = listeners.indexOf(handler)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }),
    dispatchEvent: vi.fn((event: MediaQueryListEvent) => {
      listeners.forEach(listener => listener(event))
      return true
    }),
    _trigger: (newMatches: boolean) => {
      const event = new Event("change") as unknown as MediaQueryListEvent
      Object.defineProperty(event, "matches", { value: newMatches })
      Object.defineProperty(event, "media", { value: query })
      listeners.forEach(listener => listener(event))
    }
  }) as unknown as MediaQueryList & { _trigger: (matches: boolean) => void }
}

describe("useMediaQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("возвращает начальное значение matches", () => {
    window.matchMedia = createMatchMediaMock(true)
    
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))
    expect(result.current).toBe(true)
  })

  it("возвращает false когда медиа-запрос не соответствует", () => {
    window.matchMedia = createMatchMediaMock(false)
    
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))
    expect(result.current).toBe(false)
  })

  it("обновляется при изменении медиа-запроса", () => {
    const matchMediaMock = createMatchMediaMock(false)
    window.matchMedia = matchMediaMock
    
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))
    
    expect(result.current).toBe(false)
    
    act(() => {
      matchMediaMock("(min-width: 768px)")._trigger(true)
    })
    
    expect(result.current).toBe(true)
  })

  it("отписывается от событий при размонтировании", () => {
    const matchMediaMock = createMatchMediaMock(true)
    window.matchMedia = matchMediaMock
    
    const mediaQueryList = matchMediaMock("(min-width: 768px)")
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"))
    
    unmount()
    
    expect(mediaQueryList.removeEventListener).toHaveBeenCalled()
  })

  it("возвращает false на сервере (SSR)", () => {
    const originalWindow = global.window
    // @ts-ignore
    delete global.window
    
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))
    expect(result.current).toBe(false)
    
    global.window = originalWindow
  })

  it("обновляется при изменении query", () => {
    const matchMediaMock = vi.fn((query: string) => {
      const matches = query.includes("1024px")
      return createMatchMediaMock(matches)(query)
    })
    window.matchMedia = matchMediaMock as any
    
    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: "(min-width: 768px)" } }
    )
    
    expect(result.current).toBe(false)
    
    rerender({ query: "(min-width: 1024px)" })
    
    expect(result.current).toBe(true)
  })
})

describe("useBreakpoints", () => {
  it("возвращает правильные брейкпоинты", () => {
    const queries: Record<string, boolean> = {
      "(min-width: 640px)": true,
      "(min-width: 768px)": true,
      "(min-width: 1024px)": false,
      "(min-width: 1280px)": false,
      "(min-width: 1536px)": false,
    }

    window.matchMedia = ((query: string) => 
      createMatchMediaMock(queries[query] || false)(query)
    ) as any

    const { result } = renderHook(() => useBreakpoints())

    expect(result.current).toEqual({
      isSm: true,
      isMd: true,
      isLg: false,
      isXl: false,
      is2xl: false,
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    })
  })

  it("определяет мобильное устройство", () => {
    const queries: Record<string, boolean> = {
      "(min-width: 640px)": false,
      "(min-width: 768px)": false,
      "(min-width: 1024px)": false,
      "(min-width: 1280px)": false,
      "(min-width: 1536px)": false,
    }

    window.matchMedia = ((query: string) => 
      createMatchMediaMock(queries[query] || false)(query)
    ) as any

    const { result } = renderHook(() => useBreakpoints())

    expect(result.current.isMobile).toBe(true)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
  })

  it("определяет десктоп", () => {
    const queries: Record<string, boolean> = {
      "(min-width: 640px)": true,
      "(min-width: 768px)": true,
      "(min-width: 1024px)": true,
      "(min-width: 1280px)": false,
      "(min-width: 1536px)": false,
    }

    window.matchMedia = ((query: string) => 
      createMatchMediaMock(queries[query] || false)(query)
    ) as any

    const { result } = renderHook(() => useBreakpoints())

    expect(result.current.isDesktop).toBe(true)
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
  })
})

describe("usePrefersDarkMode", () => {
  it("возвращает true когда предпочитается темная тема", () => {
    window.matchMedia = createMatchMediaMock(true)
    
    const { result } = renderHook(() => usePrefersDarkMode())
    expect(result.current).toBe(true)
  })

  it("возвращает false когда предпочитается светлая тема", () => {
    window.matchMedia = createMatchMediaMock(false)
    
    const { result } = renderHook(() => usePrefersDarkMode())
    expect(result.current).toBe(false)
  })
})

describe("usePrefersReducedMotion", () => {
  it("возвращает true когда предпочитается уменьшенная анимация", () => {
    window.matchMedia = createMatchMediaMock(true)
    
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it("возвращает false когда анимация не ограничена", () => {
    window.matchMedia = createMatchMediaMock(false)
    
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })
})
