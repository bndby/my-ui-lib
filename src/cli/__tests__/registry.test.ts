import assert from "node:assert/strict"
import test from "node:test"
import { getAllItems, loadRegistry } from "../registry.js"

test("loadRegistry возвращает элементы с meta.since", () => {
  const registry = loadRegistry()
  const items = getAllItems(registry, true)

  assert.ok(items.length > 0, "В реестре должны быть элементы")
  for (const item of items) {
    assert.equal(typeof item.meta.since, "string")
    assert.ok(item.meta.since.length > 0)
  }
})
