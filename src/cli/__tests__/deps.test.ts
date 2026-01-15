import assert from "node:assert/strict"
import test from "node:test"
import { resolveDependencies } from "../deps.js"
import { findItem, loadRegistry } from "../registry.js"

test("resolveDependencies возвращает транзитивные зависимости", () => {
  const registry = loadRegistry()
  const modal = findItem(registry, "ui/modal")
  assert.ok(modal, "Элемент ui/modal должен существовать")

  const deps = resolveDependencies(registry, modal)
  assert.deepEqual(
    deps.map((item) => item.name),
    ["hooks/use-click-outside"]
  )
})
