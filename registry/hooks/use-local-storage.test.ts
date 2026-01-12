import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useLocalStorage } from "./use-local-storage"

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("возвращает начальное значение если ключа нет в localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"))
    const [value] = result.current
    expect(value).toBe("initial")
  })

  it("возвращает значение из localStorage если оно есть", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"))
    
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"))
    const [value] = result.current
    expect(value).toBe("stored-value")
  })

  it("сохраняет значение в localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"))
    
    act(() => {
      const [, setValue] = result.current
      setValue("new-value")
    })
    
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("new-value"))
  })

  it("обновляет состояние при изменении значения", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"))
    
    act(() => {
      const [, setValue] = result.current
      setValue("updated")
    })
    
    const [value] = result.current
    expect(value).toBe("updated")
  })

  it("поддерживает функциональное обновление", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0))
    
    act(() => {
      const [, setValue] = result.current
      setValue((prev) => prev + 1)
    })
    
    const [value] = result.current
    expect(value).toBe(1)
  })

  it("удаляет значение из localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("value"))
    
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"))
    
    act(() => {
      const [, , removeValue] = result.current
      removeValue()
    })
    
    expect(localStorage.getItem("test-key")).toBeNull()
    const [value] = result.current
    expect(value).toBe("initial")
  })

  it("работает с объектами", () => {
    const initialUser = { name: "John", age: 30 }
    const { result } = renderHook(() => useLocalStorage("user", initialUser))
    
    act(() => {
      const [, setValue] = result.current
      setValue({ name: "Jane", age: 25 })
    })
    
    const [value] = result.current
    expect(value).toEqual({ name: "Jane", age: 25 })
    expect(localStorage.getItem("user")).toBe(JSON.stringify({ name: "Jane", age: 25 }))
  })

  it("работает с массивами", () => {
    const { result } = renderHook(() => useLocalStorage<number[]>("numbers", []))
    
    act(() => {
      const [, setValue] = result.current
      setValue([1, 2, 3])
    })
    
    const [value] = result.current
    expect(value).toEqual([1, 2, 3])
  })

  it("обрабатывает невалидный JSON", () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    localStorage.setItem("test-key", "invalid-json{")
    
    const { result } = renderHook(() => useLocalStorage("test-key", "default"))
    const [value] = result.current
    
    expect(value).toBe("default")
    expect(consoleWarnSpy).toHaveBeenCalled()
    
    consoleWarnSpy.mockRestore()
  })

  it("синхронизируется при изменении storage события", () => {
    const { result } = renderHook(() => useLocalStorage("sync-key", "initial"))
    
    // Симулируем изменение в другой вкладке
    act(() => {
      localStorage.setItem("sync-key", JSON.stringify("from-other-tab"))
      window.dispatchEvent(new StorageEvent("storage", { key: "sync-key" }))
    })
    
    const [value] = result.current
    expect(value).toBe("from-other-tab")
  })

  it("игнорирует события для других ключей", () => {
    const { result } = renderHook(() => useLocalStorage("key1", "value1"))
    
    act(() => {
      localStorage.setItem("key2", JSON.stringify("value2"))
      window.dispatchEvent(new StorageEvent("storage", { key: "key2" }))
    })
    
    const [value] = result.current
    expect(value).toBe("value1")
  })

  it("отправляет storage событие при изменении", () => {
    const storageListener = vi.fn()
    window.addEventListener("storage", storageListener)
    
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"))
    
    act(() => {
      const [, setValue] = result.current
      setValue("new-value")
    })
    
    expect(storageListener).toHaveBeenCalled()
    window.removeEventListener("storage", storageListener)
  })
})
