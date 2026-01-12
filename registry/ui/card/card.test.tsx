import { render, screen } from "@testing-library/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

describe("Card", () => {
  it("рендерится с контентом", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeInTheDocument()
  })

  it("применяет правильный вариант стиля", () => {
    const { container, rerender } = render(<Card variant="default">Default</Card>)
    let card = container.firstChild as HTMLElement
    expect(card).toHaveClass("default")

    rerender(<Card variant="outlined">Outlined</Card>)
    card = container.firstChild as HTMLElement
    expect(card).toHaveClass("outlined")

    rerender(<Card variant="elevated">Elevated</Card>)
    card = container.firstChild as HTMLElement
    expect(card).toHaveClass("elevated")
  })

  it("применяет noPadding класс", () => {
    const { container } = render(<Card noPadding>No padding</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("noPadding")
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<Card ref={ref}>Card</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("применяет пользовательский className", () => {
    const { container } = render(<Card className="custom-class">Card</Card>)
    expect(container.firstChild).toHaveClass("custom-class")
  })
})

describe("CardHeader", () => {
  it("рендерится с контентом", () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText("Header content")).toBeInTheDocument()
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<CardHeader ref={ref}>Header</CardHeader>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("CardTitle", () => {
  it("рендерится как h3 элемент", () => {
    render(<CardTitle>Title</CardTitle>)
    const title = screen.getByText("Title")
    expect(title.tagName).toBe("H3")
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<CardTitle ref={ref}>Title</CardTitle>)
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })
})

describe("CardDescription", () => {
  it("рендерится как параграф", () => {
    render(<CardDescription>Description</CardDescription>)
    const description = screen.getByText("Description")
    expect(description.tagName).toBe("P")
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<CardDescription ref={ref}>Description</CardDescription>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })
})

describe("CardContent", () => {
  it("рендерится с контентом", () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<CardContent ref={ref}>Content</CardContent>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("CardFooter", () => {
  it("рендерится с контентом", () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText("Footer")).toBeInTheDocument()
  })

  it("прокидывает ref", () => {
    const ref = { current: null }
    render(<CardFooter ref={ref}>Footer</CardFooter>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("Card композиция", () => {
  it("рендерит полную структуру карточки", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText("Card Title")).toBeInTheDocument()
    expect(screen.getByText("Card Description")).toBeInTheDocument()
    expect(screen.getByText("Card Content")).toBeInTheDocument()
    expect(screen.getByText("Card Footer")).toBeInTheDocument()
  })
})
