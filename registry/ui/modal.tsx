import * as React from "react"
import { createPortal } from "react-dom"
import styles from "./modal.module.css"
import { cn } from "@/lib/cn"
import { useClickOutside } from "@/hooks/use-click-outside"

export interface ModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean
  /** Callback закрытия */
  onClose: () => void
  /** Заголовок */
  title?: string
  /** Размер */
  size?: "sm" | "md" | "lg" | "full"
  /** Закрывать по клику на overlay */
  closeOnOverlayClick?: boolean
  /** Закрывать по Escape */
  closeOnEscape?: boolean
  /** Контент */
  children: React.ReactNode
  /** Дополнительные классы */
  className?: string
}

/**
 * Модальное окно
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false)
 *
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Заголовок">
 *   Контент модального окна
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className,
}: ModalProps) {
  const contentRef = useClickOutside<HTMLDivElement>(
    () => closeOnOverlayClick && onClose(),
    isOpen
  )

  // Закрытие по Escape
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Блокировка скролла body
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const modal = (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div
        ref={contentRef}
        className={cn(styles.content, styles[size], className)}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрыть"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Футер модального окна
 */
export function ModalFooter({ className, children, ...props }: ModalFooterProps) {
  return (
    <div className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  )
}
