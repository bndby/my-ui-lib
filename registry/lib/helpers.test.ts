import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  sleep,
  generateId,
  debounce,
  throttle,
  clamp,
  random,
  randomInt,
  shuffle,
  chunk,
  unique,
  groupBy,
  pick,
  omit,
  deepClone,
  deepEqual,
  isEmpty,
  isObject,
} from "./helpers"

describe("sleep", () => {
  it("задерживает выполнение на указанное время", async () => {
    const start = Date.now()
    await sleep(100)
    const duration = Date.now() - start
    expect(duration).toBeGreaterThanOrEqual(95) // небольшая погрешность
  })
})

describe("generateId", () => {
  it("генерирует уникальные ID", () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it("генерирует строку", () => {
    const id = generateId()
    expect(typeof id).toBe("string")
    expect(id.length).toBeGreaterThan(0)
  })

  it("генерирует разные ID при множественных вызовах", () => {
    const ids = Array.from({ length: 100 }, () => generateId())
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(100)
  })
})

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("откладывает вызов функции", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("вызывает функцию только один раз при множественных вызовах", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced()
    debounced()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("сбрасывает таймер при новых вызовах", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(50)
    
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("передает аргументы в функцию", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced("arg1", "arg2")
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith("arg1", "arg2")
  })
})

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("вызывает функцию немедленно при первом вызове", () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("игнорирует вызовы в течение периода throttle", () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("позволяет новый вызов после периода throttle", () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()
    vi.advanceTimersByTime(100)
    throttled()

    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe("clamp", () => {
  it("ограничивает значение в пределах диапазона", () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it("работает с отрицательными числами", () => {
    expect(clamp(-5, -10, -1)).toBe(-5)
    expect(clamp(-15, -10, -1)).toBe(-10)
    expect(clamp(0, -10, -1)).toBe(-1)
  })
})

describe("random", () => {
  it("возвращает число в заданном диапазоне", () => {
    const result = random(0, 10)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(10)
  })

  it("работает с отрицательными числами", () => {
    const result = random(-10, -5)
    expect(result).toBeGreaterThanOrEqual(-10)
    expect(result).toBeLessThanOrEqual(-5)
  })
})

describe("randomInt", () => {
  it("возвращает целое число в заданном диапазоне", () => {
    const result = randomInt(0, 10)
    expect(Number.isInteger(result)).toBe(true)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(10)
  })
})

describe("shuffle", () => {
  it("перемешивает массив", () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle([...arr])
    
    expect(shuffled).toHaveLength(arr.length)
    expect(shuffled.sort()).toEqual(arr.sort())
  })

  it("не изменяет исходный массив", () => {
    const arr = [1, 2, 3]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })
})

describe("chunk", () => {
  it("разбивает массив на части заданного размера", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it("обрабатывает пустой массив", () => {
    expect(chunk([], 2)).toEqual([])
  })

  it("обрабатывает размер больше длины массива", () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]])
  })
})

describe("unique", () => {
  it("удаляет дубликаты из массива", () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  it("работает со строками", () => {
    expect(unique(["a", "b", "b", "c"])).toEqual(["a", "b", "c"])
  })

  it("сохраняет порядок", () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
  })
})

describe("groupBy", () => {
  it("группирует элементы по ключу", () => {
    const items = [
      { type: "fruit", name: "apple" },
      { type: "fruit", name: "banana" },
      { type: "vegetable", name: "carrot" },
    ]

    const grouped = groupBy(items, "type")
    expect(grouped.fruit).toHaveLength(2)
    expect(grouped.vegetable).toHaveLength(1)
  })

  it("обрабатывает пустой массив", () => {
    expect(groupBy([], "key")).toEqual({})
  })
})

describe("pick", () => {
  it("выбирает указанные свойства из объекта", () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 })
  })

  it("игнорирует несуществующие свойства", () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, ["a", "c"] as any)).toEqual({ a: 1 })
  })
})

describe("omit", () => {
  it("исключает указанные свойства из объекта", () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, ["b"])).toEqual({ a: 1, c: 3 })
  })

  it("возвращает копию если нет свойств для исключения", () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, [])).toEqual(obj)
  })
})

describe("deepClone", () => {
  it("клонирует объект", () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = deepClone(obj)
    
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })

  it("клонирует массив", () => {
    const arr = [1, [2, 3]]
    const cloned = deepClone(arr)
    
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[1]).not.toBe(arr[1])
  })

  it("клонирует примитивы", () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone("string")).toBe("string")
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
  })
})

describe("deepEqual", () => {
  it("сравнивает примитивы", () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual("a", "a")).toBe(true)
    expect(deepEqual(true, true)).toBe(true)
    expect(deepEqual(1, 2)).toBe(false)
  })

  it("сравнивает объекты", () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false)
  })

  it("сравнивает вложенные объекты", () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
  })

  it("сравнивает массивы", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
  })
})

describe("isEmpty", () => {
  it("проверяет пустые значения", () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty("")).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
  })

  it("проверяет непустые значения", () => {
    expect(isEmpty("string")).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(false)).toBe(false)
  })
})

describe("isObject", () => {
  it("определяет объекты", () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
  })

  it("не определяет не-объекты как объекты", () => {
    expect(isObject(null)).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject("string")).toBe(false)
    expect(isObject(123)).toBe(false)
  })
})
