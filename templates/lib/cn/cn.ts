/**
 * Утилита для объединения CSS классов
 * Фильтрует falsy значения и объединяет остальные
 *
 * @example
 * cn("btn", isActive && "btn-active", className)
 * // => "btn btn-active custom-class"
 *
 * cn("card", { "card-selected": isSelected, "card-disabled": isDisabled })
 * // => "card card-selected"
 */
export function cn(
  ...inputs: (string | boolean | null | undefined | Record<string, boolean | undefined>)[]
): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === "string") {
      classes.push(input)
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(" ")
}
