import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Modal, ModalFooter } from "./modal"

describe("Modal", () => {
  beforeEach(() => {
    // Создаём контейнер для портала
    const portalRoot = document.createElement("div")
    portalRoot.setAttribute("id", "portal-root")
    document.body.appendChild(portalRoot)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("не рендерится когда isOpen=false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Modal content
      </Modal>
    )
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument()
  })

  it("рендерится когда isOpen=true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal content
      </Modal>
    )
    expect(screen.getByText("Modal content")).toBeInTheDocument()
  })

  it("рендерит заголовок", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Title">
        Content
      </Modal>
    )
    expect(screen.getByText("Modal Title")).toBeInTheDocument()
  })

  it("рендерит кнопку закрытия с заголовком", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Title">
        Content
      </Modal>
    )
    const closeButton = screen.getByLabelText("Закрыть")
    expect(closeButton).toBeInTheDocument()
  })

  it("вызывает onClose при клике на кнопку закрытия", async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    )
    
    await user.click(screen.getByLabelText("Закрыть"))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it("вызывает onClose при нажатии Escape", async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
        Content
      </Modal>
    )
    
    await user.keyboard("{Escape}")
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it("не закрывается при Escape если closeOnEscape=false", async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
        Content
      </Modal>
    )
    
    await user.keyboard("{Escape}")
    expect(handleClose).not.toHaveBeenCalled()
  })

  it("применяет правильный размер", () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        Content
      </Modal>
    )
    let content = container.querySelector('[role="dialog"]')?.firstChild as HTMLElement
    expect(content).toHaveClass("sm")

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        Content
      </Modal>
    )
    content = container.querySelector('[role="dialog"]')?.firstChild as HTMLElement
    expect(content).toHaveClass("lg")
  })

  it("применяет пользовательский className", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} className="custom-class">
        Content
      </Modal>
    )
    const content = container.querySelector('[role="dialog"]')?.firstChild as HTMLElement
    expect(content).toHaveClass("custom-class")
  })

  it("имеет правильные aria атрибуты", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>
    )
    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
  })

  it("блокирует скролл body когда открыто", () => {
    const originalOverflow = document.body.style.overflow
    
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe("hidden")
    
    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>
    )
    
    // После закрытия overflow должен восстановиться
    waitFor(() => {
      expect(document.body.style.overflow).toBe(originalOverflow)
    })
  })

  it("рендерится в document.body через portal", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Portal content
      </Modal>
    )
    
    // Проверяем что контент находится прямо в body
    const modalInBody = document.body.querySelector('[role="dialog"]')
    expect(modalInBody).toBeInTheDocument()
  })
})

describe("ModalFooter", () => {
  it("рендерится с контентом", () => {
    render(<ModalFooter>Footer content</ModalFooter>)
    expect(screen.getByText("Footer content")).toBeInTheDocument()
  })

  it("применяет пользовательский className", () => {
    const { container } = render(
      <ModalFooter className="custom-footer">Footer</ModalFooter>
    )
    expect(container.firstChild).toHaveClass("custom-footer")
  })

  it("используется внутри Modal", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <ModalFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </ModalFooter>
      </Modal>
    )
    
    expect(screen.getByText("Cancel")).toBeInTheDocument()
    expect(screen.getByText("Confirm")).toBeInTheDocument()
  })
})
