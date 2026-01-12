import { renderHook } from "@testing-library/react"
import { act } from "react"
import { useClickOutside, useClickOutsideMultiple } from "./use-click-outside"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

describe("useClickOutside", () => {
  it("вызывает handler при клике вне элемента", () => {
    const handler = vi.fn()
    const { result } = renderHook(() => useClickOutside(handler, true))

    const element = document.createElement("div")
    const outsideElement = document.createElement("div")
    document.body.appendChild(element)
    document.body.appendChild(outsideElement)

    // @ts-ignore
    result.current.current = element

    act(() => {
      outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
    document.body.removeChild(outsideElement)
  })

  it("не вызывает handler при клике внутри элемента", () => {
    const handler = vi.fn()
    const { result } = renderHook(() => useClickOutside(handler, true))

    const element = document.createElement("div")
    const childElement = document.createElement("span")
    element.appendChild(childElement)
    document.body.appendChild(element)

    // @ts-ignore
    result.current.current = element

    act(() => {
      childElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it("не вызывает handler когда enabled=false", () => {
    const handler = vi.fn()
    const { result } = renderHook(() => useClickOutside(handler, false))

    const element = document.createElement("div")
    const outsideElement = document.createElement("div")
    document.body.appendChild(element)
    document.body.appendChild(outsideElement)

    // @ts-ignore
    result.current.current = element

    act(() => {
      outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
    document.body.removeChild(outsideElement)
  })

  it("реагирует на touchstart события", () => {
    const handler = vi.fn()
    const { result } = renderHook(() => useClickOutside(handler, true))

    const element = document.createElement("div")
    const outsideElement = document.createElement("div")
    document.body.appendChild(element)
    document.body.appendChild(outsideElement)

    // @ts-ignore
    result.current.current = element

    act(() => {
      outsideElement.dispatchEvent(new TouchEvent("touchstart", { bubbles: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
    document.body.removeChild(outsideElement)
  })

  it("обновляет handler без пересоздания эффекта", () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const { result, rerender } = renderHook(
      ({ handler }) => useClickOutside(handler, true),
      { initialProps: { handler: handler1 } }
    )

    const element = document.createElement("div")
    const outsideElement = document.createElement("div")
    document.body.appendChild(element)
    document.body.appendChild(outsideElement)

    // @ts-ignore
    result.current.current = element

    // Обновляем handler
    rerender({ handler: handler2 })

    act(() => {
      outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
    document.body.removeChild(outsideElement)
  })

  it("возвращает ref объект", () => {
    const handler = vi.fn()
    const { result } = renderHook(() => useClickOutside(handler, true))

    expect(result.current).toHaveProperty("current")
    expect(result.current.current).toBeNull()
  })

  it("удаляет слушатели при размонтировании", () => {
    const handler = vi.fn()
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener")

    const { unmount } = renderHook(() => useClickOutside(handler, true))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousedown", expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith("touchstart", expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })
})

describe("useClickOutsideMultiple", () => {
  it("вызывает handler при клике вне всех элементов", () => {
    const handler = vi.fn()
    const ref1 = { current: null as HTMLElement | null }
    const ref2 = { current: null as HTMLElement | null }

    renderHook(() => useClickOutsideMultiple([ref1, ref2], handler, true))

    const element1 = document.createElement("div")
    const element2 = document.createElement("div")
    const outsideElement = document.createElement("div")
    
    document.body.appendChild(element1)
    document.body.appendChild(element2)
    document.body.appendChild(outsideElement)

    ref1.current = element1
    ref2.current = element2

    act(() => {
      outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(element1)
    document.body.removeChild(element2)
    document.body.removeChild(outsideElement)
  })

  it("не вызывает handler при клике внутри одного из элементов", () => {
    const handler = vi.fn()
    const ref1 = { current: null as HTMLElement | null }
    const ref2 = { current: null as HTMLElement | null }

    renderHook(() => useClickOutsideMultiple([ref1, ref2], handler, true))

    const element1 = document.createElement("div")
    const element2 = document.createElement("div")
    
    document.body.appendChild(element1)
    document.body.appendChild(element2)

    ref1.current = element1
    ref2.current = element2

    act(() => {
      element1.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()

    act(() => {
      element2.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element1)
    document.body.removeChild(element2)
  })

  it("не вызывает handler когда enabled=false", () => {
    const handler = vi.fn()
    const ref1 = { current: null as HTMLElement | null }
    const ref2 = { current: null as HTMLElement | null }

    renderHook(() => useClickOutsideMultiple([ref1, ref2], handler, false))

    const element1 = document.createElement("div")
    const element2 = document.createElement("div")
    const outsideElement = document.createElement("div")
    
    document.body.appendChild(element1)
    document.body.appendChild(element2)
    document.body.appendChild(outsideElement)

    ref1.current = element1
    ref2.current = element2

    act(() => {
      outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element1)
    document.body.removeChild(element2)
    document.body.removeChild(outsideElement)
  })

  it("работает с пустым массивом refs", () => {
    const handler = vi.fn()

    renderHook(() => useClickOutsideMultiple([], handler, true))

    const outsideElement = document.createElement("div")
    document.body.appendChild(outsideElement)

    act(() => {
      outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(outsideElement)
  })
})
