import { cn } from "./cn"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

describe("cn", () => {
  it("объединяет строки классов", () => {
    expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3")
  })

  it("фильтрует falsy значения", () => {
    expect(cn("class1", false, "class2", null, "class3", undefined)).toBe("class1 class2 class3")
  })

  it("обрабатывает условные классы", () => {
    const isActive = true
    const isDisabled = false

    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe("base active")
  })

  it("работает с пустыми значениями", () => {
    expect(cn("", "class1", "", "class2")).toBe("class1 class2")
  })

  it("возвращает пустую строку для пустого ввода", () => {
    expect(cn()).toBe("")
  })

  it("возвращает пустую строку для только falsy значений", () => {
    expect(cn(false, null, undefined, "")).toBe("")
  })

  it("обрабатывает объекты (через clsx)", () => {
    expect(cn({ active: true, disabled: false, "text-red": true })).toBe("active text-red")
  })

  it("обрабатывает массивы", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3")
  })

  it("комбинирует разные типы входных данных", () => {
    expect(
      cn(
        "base-class",
        { active: true, disabled: false },
        ["array-class-1", "array-class-2"],
        true && "conditional-class",
        false && "hidden-class"
      )
    ).toBe("base-class active array-class-1 array-class-2 conditional-class")
  })

  it("удаляет дублирующиеся классы (через twMerge)", () => {
    // twMerge удаляет конфликтующие Tailwind классы
    expect(cn("px-4 py-2", "px-6")).toBe("py-2 px-6")
  })

  it("объединяет Tailwind классы корректно", () => {
    expect(cn("text-sm font-bold", "text-lg")).toBe("font-bold text-lg")
  })

  it("работает с undefined классами", () => {
    const className = undefined
    expect(cn("base", className, "other")).toBe("base other")
  })

  it("работает с числами (преобразует в строки)", () => {
    expect(cn("class", 123, "other")).toBe("class 123 other")
  })

  it("обрабатывает вложенные массивы", () => {
    expect(cn([["nested1", "nested2"], "class3"])).toBe("nested1 nested2 class3")
  })

  it("работает в реальных сценариях использования", () => {
    const isActive = true
    const variant = "primary"
    const size = "lg"
    const customClass = "custom-button"

    expect(
      cn(
        "btn",
        isActive && "active",
        `variant-${variant}`,
        `size-${size}`,
        customClass
      )
    ).toBe("btn active variant-primary size-lg custom-button")
  })

  it("работает с CSS модулями", () => {
    const styles = {
      button: "button_hash123",
      primary: "primary_hash456",
      large: "large_hash789",
    }

    expect(
      cn(styles.button, styles.primary, styles.large)
    ).toBe("button_hash123 primary_hash456 large_hash789")
  })
})
