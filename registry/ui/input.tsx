import * as React from "react"
import styles from "./input.module.css"
import { cn } from "@/lib/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Лейбл над полем ввода */
  label?: string
  /** Текст ошибки */
  error?: string
  /** Подсказка под полем */
  hint?: string
  /** Иконка слева */
  leftIcon?: React.ReactNode
  /** Иконка справа */
  rightIcon?: React.ReactNode
  /** Размер */
  inputSize?: "sm" | "md" | "lg"
}

/**
 * Компонент текстового ввода
 *
 * @example
 * <Input placeholder="Email" type="email" />
 * <Input label="Имя" error="Обязательное поле" />
 * <Input leftIcon={<SearchIcon />} placeholder="Поиск..." />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = "md",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {leftIcon && (
            <span className={cn(styles.icon, styles.leftIcon)}>{leftIcon}</span>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              styles.input,
              styles[inputSize],
              leftIcon && styles.hasLeftIcon,
              rightIcon && styles.hasRightIcon,
              error && styles.hasError,
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <span className={cn(styles.icon, styles.rightIcon)}>
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.error}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
