import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Input } from "./input"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

describe("Input", () => {
  it("рендерится с placeholder", () => {
    render(<Input placeholder="Введите текст" />)
    expect(screen.getByPlaceholderText("Введите текст")).toBeInTheDocument()
  })

  it("рендерит label", () => {
    render(<Input label="Email" placeholder="email@example.com" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("связывает label с input через htmlFor", () => {
    render(<Input label="Username" id="username" />)
    const label = screen.getByText("Username")
    const input = screen.getByLabelText("Username")
    expect(label).toHaveAttribute("for", "username")
    expect(input).toHaveAttribute("id", "username")
  })

  it("генерирует уникальный id если не передан", () => {
    const { container } = render(<Input label="Field" />)
    const input = container.querySelector("input")
    expect(input).toHaveAttribute("id")
    expect(input?.id).toBeTruthy()
  })

  it("показывает сообщение об ошибке", () => {
    render(<Input label="Email" error="Неверный формат email" />)
    expect(screen.getByText("Неверный формат email")).toBeInTheDocument()
  })

  it("применяет класс ошибки к input", () => {
    render(<Input error="Error message" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("hasError")
  })

  it("показывает hint", () => {
    render(<Input hint="Минимум 8 символов" />)
    expect(screen.getByText("Минимум 8 символов")).toBeInTheDocument()
  })

  it("скрывает hint когда есть error", () => {
    render(<Input hint="Hint text" error="Error text" />)
    expect(screen.getByText("Error text")).toBeInTheDocument()
    expect(screen.queryByText("Hint text")).not.toBeInTheDocument()
  })

  it("применяет правильный размер", () => {
    const { rerender } = render(<Input inputSize="sm" />)
    let input = screen.getByRole("textbox")
    expect(input).toHaveClass("sm")

    rerender(<Input inputSize="lg" />)
    input = screen.getByRole("textbox")
    expect(input).toHaveClass("lg")
  })

  it("рендерит левую иконку", () => {
    render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />)
    expect(screen.getByTestId("left-icon")).toBeInTheDocument()
  })

  it("рендерит правую иконку", () => {
    render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />)
    expect(screen.getByTestId("right-icon")).toBeInTheDocument()
  })

  it("применяет классы для иконок", () => {
    render(<Input leftIcon={<span>←</span>} rightIcon={<span>→</span>} />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("hasLeftIcon")
    expect(input).toHaveClass("hasRightIcon")
  })

  it("обрабатывает ввод текста", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole("textbox")
    
    await user.type(input, "Hello")
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue("Hello")
  })

  it("устанавливает aria-invalid при ошибке", () => {
    render(<Input error="Error" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("связывает error с input через aria-describedby", () => {
    render(<Input id="email" error="Invalid email" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-describedby", "email-error")
  })

  it("связывает hint с input через aria-describedby", () => {
    render(<Input id="password" hint="Min 8 characters" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-describedby", "password-hint")
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("применяет пользовательский className", () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole("textbox")).toHaveClass("custom-class")
  })

  it("поддерживает разные типы input", () => {
    const { rerender } = render(<Input type="email" />)
    let input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("type", "email")

    rerender(<Input type="password" />)
    // Password input не имеет роли textbox
    input = document.querySelector('input[type="password"]') as HTMLInputElement
    expect(input).toHaveAttribute("type", "password")
  })

  it("отключается при disabled", () => {
    render(<Input disabled />)
    const input = screen.getByRole("textbox")
    expect(input).toBeDisabled()
  })
})
