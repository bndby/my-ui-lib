import { renderHook, waitFor } from "@testing-library/react"
import { act } from "react"
import { useDebounce, useDebouncedCallback } from "./use-debounce"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("возвращает начальное значение немедленно", () => {
    const { result } = renderHook(() => useDebounce("initial", 500))
    expect(result.current).toBe("initial")
  })

  it("задерживает обновление значения", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    )

    expect(result.current).toBe("initial")

    // Обновляем значение
    rerender({ value: "updated", delay: 500 })
    
    // Значение еще не должно измениться
    expect(result.current).toBe("initial")

    // Прогоняем таймеры
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Теперь значение должно обновиться
    expect(result.current).toBe("updated")
  })

  it("сбрасывает таймер при быстрых изменениях", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "update1" })
    act(() => vi.advanceTimersByTime(200))
    
    rerender({ value: "update2" })
    act(() => vi.advanceTimersByTime(200))
    
    rerender({ value: "final" })
    
    // Значение все еще должно быть начальным
    expect(result.current).toBe("initial")

    // Прогоняем оставшееся время
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Должно быть последнее значение
    expect(result.current).toBe("final")
  })

  it("работает с разными задержками", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 1000 } }
    )

    rerender({ value: "updated", delay: 1000 })

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe("updated")
  })

  it("работает с объектами", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: { name: "John" } } }
    )

    rerender({ value: { name: "Jane" } })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toEqual({ name: "Jane" })
  })

  it("очищает таймер при размонтировании", () => {
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })
    unmount()

    // Не должно быть ошибок при размонтировании
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(500)
      })
    }).not.toThrow()
  })
})

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("задерживает вызов функции", () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current("test")
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledWith("test")
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("вызывает функцию только один раз при множественных вызовах", () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current("call1")
      result.current("call2")
      result.current("call3")
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith("call3")
  })

  it("сбрасывает таймер при каждом вызове", () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current("first")
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    act(() => {
      result.current("second")
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Первый вызов не должен был произойти
    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Должен вызваться только второй
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith("second")
  })

  it("передает все аргументы в callback", () => {
    const callback = vi.fn()
    const { result } = renderHook(() => 
      useDebouncedCallback((a: number, b: string, c: boolean) => callback(a, b, c), 300)
    )

    act(() => {
      result.current(1, "test", true)
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(callback).toHaveBeenCalledWith(1, "test", true)
  })

  it("обновляет callback без сброса таймера", () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    
    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 500),
      { initialProps: { cb: callback1 } }
    )

    act(() => {
      result.current("test")
    })

    rerender({ cb: callback2 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalledWith("test")
  })

  it("очищает таймер при размонтировании", () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current("test")
    })

    unmount()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it("возвращает стабильную ссылку на функцию", () => {
    const callback = vi.fn()
    const { result, rerender } = renderHook(
      ({ delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { delay: 500 } }
    )

    const firstRef = result.current
    
    rerender({ delay: 500 })
    
    expect(result.current).toBe(firstRef)
  })
})
