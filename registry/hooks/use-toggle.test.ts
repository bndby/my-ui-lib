import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useToggle } from "./use-toggle"

describe("useToggle", () => {
  it("возвращает начальное значение false по умолчанию", () => {
    const { result } = renderHook(() => useToggle())
    const [value] = result.current
    expect(value).toBe(false)
  })

  it("возвращает переданное начальное значение", () => {
    const { result } = renderHook(() => useToggle(true))
    const [value] = result.current
    expect(value).toBe(true)
  })

  it("переключает значение при вызове toggle", () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      const [, toggle] = result.current
      toggle()
    })

    const [value] = result.current
    expect(value).toBe(true)

    act(() => {
      const [, toggle] = result.current
      toggle()
    })

    expect(result.current[0]).toBe(false)
  })

  it("устанавливает конкретное значение через setValue", () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      const [, , setValue] = result.current
      setValue(true)
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      const [, , setValue] = result.current
      setValue(false)
    })

    expect(result.current[0]).toBe(false)
  })

  it("toggle функция стабильна между рендерами", () => {
    const { result, rerender } = renderHook(() => useToggle(false))

    const [, firstToggle] = result.current

    act(() => {
      firstToggle()
    })

    rerender()

    const [, secondToggle] = result.current

    expect(firstToggle).toBe(secondToggle)
  })

  it("возвращает массив из трех элементов", () => {
    const { result } = renderHook(() => useToggle())

    expect(Array.isArray(result.current)).toBe(true)
    expect(result.current).toHaveLength(3)
    expect(typeof result.current[0]).toBe("boolean")
    expect(typeof result.current[1]).toBe("function")
    expect(typeof result.current[2]).toBe("function")
  })

  it("множественные переключения работают корректно", () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      const [, toggle] = result.current
      toggle()
      toggle()
      toggle()
    })

    expect(result.current[0]).toBe(true)
  })

  it("setValue не переключает, а устанавливает значение", () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      const [, , setValue] = result.current
      setValue(true)
      setValue(true)
      setValue(true)
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      const [, , setValue] = result.current
      setValue(false)
      setValue(false)
    })

    expect(result.current[0]).toBe(false)
  })
})
