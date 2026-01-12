import * as React from "react"
import styles from "./card.module.css"
import { cn } from "../../lib/cn"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Вариант стиля */
  variant?: "default" | "outlined" | "elevated"
  /** Убрать внутренние отступы */
  noPadding?: boolean
}

/**
 * Контейнер карточки
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", noPadding, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        styles.card,
        styles[variant],
        noPadding && styles.noPadding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

/**
 * Заголовок карточки
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.header, className)} {...props} />
))
CardHeader.displayName = "CardHeader"

/**
 * Заголовок (h3) карточки
 */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn(styles.title, className)} {...props} />
))
CardTitle.displayName = "CardTitle"

/**
 * Описание карточки
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.description, className)} {...props} />
))
CardDescription.displayName = "CardDescription"

/**
 * Основной контент карточки
 */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.content, className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Футер карточки
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.footer, className)} {...props} />
))
CardFooter.displayName = "CardFooter"
