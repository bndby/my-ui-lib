import * as React from "react"
import styles from "./button.module.css"
import { cn } from "@/lib/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант стиля */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  /** Размер кнопки */
  size?: "sm" | "md" | "lg"
  /** Показывать индикатор загрузки */
  isLoading?: boolean
  /** Растянуть на всю ширину */
  fullWidth?: boolean
  /** Иконка слева от текста */
  leftIcon?: React.ReactNode
  /** Иконка справа от текста */
  rightIcon?: React.ReactNode
}

/**
 * Универсальный компонент кнопки
 *
 * @example
 * <Button variant="primary">Нажми меня</Button>
 * <Button variant="danger" size="sm">Удалить</Button>
 * <Button isLoading>Загрузка...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          isLoading && styles.loading,
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : leftIcon ? (
          <span className={styles.icon}>{leftIcon}</span>
        ) : null}
        <span className={styles.label}>{children}</span>
        {rightIcon && !isLoading && (
          <span className={styles.icon}>{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
