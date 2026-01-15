import { Registry, RegistryItem } from "./types"
import { findItem } from "./registry"

export function resolveDependencies(
  registry: Registry,
  item: RegistryItem,
  resolved: Set<string> = new Set()
): RegistryItem[] {
  const deps: RegistryItem[] = []

  for (const depName of item.dependencies) {
    if (resolved.has(depName)) continue
    resolved.add(depName)

    const dep = findItem(registry, depName)
    if (dep) {
      deps.push(...resolveDependencies(registry, dep, resolved))
      deps.push(dep)
    }
  }

  return deps
}
