import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"

describe("Button", () => {
  it("рендерится с текстом", () => {
    render(<Button>Нажми меня</Button>)
    expect(screen.getByText("Нажми меня")).toBeInTheDocument()
  })

  it("применяет правильный вариант стиля", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    let button = screen.getByRole("button")
    expect(button).toHaveClass("primary")

    rerender(<Button variant="danger">Danger</Button>)
    button = screen.getByRole("button")
    expect(button).toHaveClass("danger")
  })

  it("применяет правильный размер", () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole("button")
    expect(button).toHaveClass("sm")

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole("button")
    expect(button).toHaveClass("lg")
  })

  it("отключается при isLoading=true", () => {
    render(<Button isLoading>Loading</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("показывает спиннер при загрузке", () => {
    render(<Button isLoading>Loading</Button>)
    const spinner = screen.getByRole("button").querySelector('[aria-hidden="true"]')
    expect(spinner).toBeInTheDocument()
  })

  it("применяет fullWidth класс", () => {
    render(<Button fullWidth>Full Width</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("fullWidth")
  })

  it("рендерит левую иконку", () => {
    render(<Button leftIcon={<span data-testid="left-icon">←</span>}>Button</Button>)
    expect(screen.getByTestId("left-icon")).toBeInTheDocument()
  })

  it("рендерит правую иконку", () => {
    render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Button</Button>)
    expect(screen.getByTestId("right-icon")).toBeInTheDocument()
  })

  it("скрывает иконки при загрузке", () => {
    render(
      <Button
        isLoading
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Loading
      </Button>
    )
    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument()
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument()
  })

  it("вызывает onClick при клике", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole("button"))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("не вызывает onClick если disabled", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    await user.click(screen.getByRole("button"))
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<Button ref={ref}>Button</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("применяет пользовательский className", () => {
    render(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole("button")).toHaveClass("custom-class")
  })

  it("прокидывает HTML атрибуты", () => {
    render(<Button type="submit" data-testid="submit-button">Submit</Button>)
    const button = screen.getByTestId("submit-button")
    expect(button).toHaveAttribute("type", "submit")
  })
})
