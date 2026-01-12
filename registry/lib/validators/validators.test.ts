import {
  isEmail,
  isPhone,
  isURL,
  isINN,
  isSNILS,
  isPassport,
  isAlpha,
  isAlphaNumeric,
  isNumeric,
  isStrongPassword,
  isCreditCard,
  isDate,
  isIPAddress,
} from "./validators"

// Тесты совместимы с Jest, Vitest и Rstest (используют глобальные переменные)

describe("isEmail", () => {
  it("валидирует правильные email адреса", () => {
    expect(isEmail("test@example.com")).toBe(true)
    expect(isEmail("user.name+tag@example.co.uk")).toBe(true)
    expect(isEmail("user_name@example.org")).toBe(true)
  })

  it("отклоняет неправильные email адреса", () => {
    expect(isEmail("invalid")).toBe(false)
    expect(isEmail("@example.com")).toBe(false)
    expect(isEmail("user@")).toBe(false)
    expect(isEmail("user @example.com")).toBe(false)
  })

  it("обрабатывает пустую строку", () => {
    expect(isEmail("")).toBe(false)
  })
})

describe("isPhone", () => {
  it("валидирует российские номера", () => {
    expect(isPhone("+79001234567")).toBe(true)
    expect(isPhone("89001234567")).toBe(true)
    expect(isPhone("79001234567")).toBe(true)
    expect(isPhone("+7 (900) 123-45-67")).toBe(true)
    expect(isPhone("8 (900) 123-45-67")).toBe(true)
  })

  it("отклоняет неправильные номера", () => {
    expect(isPhone("123")).toBe(false)
    expect(isPhone("8900123456")).toBe(false) // не хватает одной цифры
    expect(isPhone("+7900123456789")).toBe(false) // слишком длинный
  })

  it("обрабатывает пустую строку", () => {
    expect(isPhone("")).toBe(false)
  })
})

describe("isURL", () => {
  it("валидирует правильные URL", () => {
    expect(isURL("https://example.com")).toBe(true)
    expect(isURL("http://example.com")).toBe(true)
    expect(isURL("https://example.com/path?query=1")).toBe(true)
    expect(isURL("https://sub.example.com:8080")).toBe(true)
  })

  it("отклоняет неправильные URL", () => {
    expect(isURL("not a url")).toBe(false)
    expect(isURL("example.com")).toBe(false) // без протокола
    expect(isURL("http://")).toBe(false)
  })

  it("обрабатывает пустую строку", () => {
    expect(isURL("")).toBe(false)
  })
})

describe("isINN", () => {
  it("валидирует правильные ИНН (10 цифр)", () => {
    expect(isINN("7707083893")).toBe(true)
  })

  it("валидирует правильные ИНН (12 цифр)", () => {
    expect(isINN("500100732259")).toBe(true)
  })

  it("отклоняет неправильные ИНН", () => {
    expect(isINN("1234567890")).toBe(false)
    expect(isINN("123")).toBe(false)
    expect(isINN("abcdefghij")).toBe(false)
  })

  it("обрабатывает пустую строку", () => {
    expect(isINN("")).toBe(false)
  })
})

describe("isSNILS", () => {
  it("валидирует правильные СНИЛС", () => {
    expect(isSNILS("11223344595")).toBe(true)
    expect(isSNILS("112-233-445 95")).toBe(true)
  })

  it("отклоняет неправильные СНИЛС", () => {
    expect(isSNILS("12345678901")).toBe(false)
    expect(isSNILS("123")).toBe(false)
  })

  it("обрабатывает пустую строку", () => {
    expect(isSNILS("")).toBe(false)
  })
})

describe("isPassport", () => {
  it("валидирует правильные номера паспорта", () => {
    expect(isPassport("1234 567890")).toBe(true)
    expect(isPassport("1234567890")).toBe(true)
  })

  it("отклоняет неправильные номера паспорта", () => {
    expect(isPassport("123")).toBe(false)
    expect(isPassport("abcd efghij")).toBe(false)
  })

  it("обрабатывает пустую строку", () => {
    expect(isPassport("")).toBe(false)
  })
})

describe("isAlpha", () => {
  it("валидирует только буквы", () => {
    expect(isAlpha("abc")).toBe(true)
    expect(isAlpha("ABC")).toBe(true)
    expect(isAlpha("абв")).toBe(true)
  })

  it("отклоняет строки с цифрами или символами", () => {
    expect(isAlpha("abc123")).toBe(false)
    expect(isAlpha("abc-def")).toBe(false)
    expect(isAlpha("abc def")).toBe(false)
  })

  it("обрабатывает пустую строку", () => {
    expect(isAlpha("")).toBe(false)
  })
})

describe("isAlphaNumeric", () => {
  it("валидирует буквы и цифры", () => {
    expect(isAlphaNumeric("abc123")).toBe(true)
    expect(isAlphaNumeric("ABC123")).toBe(true)
    expect(isAlphaNumeric("test")).toBe(true)
    expect(isAlphaNumeric("123")).toBe(true)
  })

  it("отклоняет строки со специальными символами", () => {
    expect(isAlphaNumeric("abc-123")).toBe(false)
    expect(isAlphaNumeric("abc 123")).toBe(false)
    expect(isAlphaNumeric("abc@123")).toBe(false)
  })

  it("обрабатывает пустую строку", () => {
    expect(isAlphaNumeric("")).toBe(false)
  })
})

describe("isNumeric", () => {
  it("валидирует числа", () => {
    expect(isNumeric("123")).toBe(true)
    expect(isNumeric("0")).toBe(true)
    expect(isNumeric("123.45")).toBe(true)
    expect(isNumeric("-123")).toBe(true)
  })

  it("отклоняет не числа", () => {
    expect(isNumeric("abc")).toBe(false)
    expect(isNumeric("12a3")).toBe(false)
    expect(isNumeric("")).toBe(false)
  })
})

describe("isStrongPassword", () => {
  it("валидирует сильные пароли", () => {
    expect(isStrongPassword("Abc123!@#")).toBe(true)
    expect(isStrongPassword("MyP@ssw0rd")).toBe(true)
  })

  it("отклоняет слабые пароли", () => {
    expect(isStrongPassword("abc")).toBe(false) // слишком короткий
    expect(isStrongPassword("abcdefgh")).toBe(false) // нет цифр, заглавных, символов
    expect(isStrongPassword("ABCDEFGH")).toBe(false) // нет строчных, цифр, символов
    expect(isStrongPassword("12345678")).toBe(false) // нет букв, символов
    expect(isStrongPassword("Abcdefgh")).toBe(false) // нет цифр, символов
    expect(isStrongPassword("Abcdef12")).toBe(false) // нет символов
  })

  it("обрабатывает пустую строку", () => {
    expect(isStrongPassword("")).toBe(false)
  })
})

describe("isCreditCard", () => {
  it("валидирует корректные номера карт (с алгоритмом Луна)", () => {
    expect(isCreditCard("4532015112830366")).toBe(true) // Visa
    expect(isCreditCard("6011514433546201")).toBe(true) // Discover
    expect(isCreditCard("5425233430109903")).toBe(true) // Mastercard
  })

  it("отклоняет некорректные номера карт", () => {
    expect(isCreditCard("1234567890123456")).toBe(false)
    expect(isCreditCard("4532015112830367")).toBe(false) // неверная контрольная сумма
  })

  it("обрабатывает номера с пробелами и дефисами", () => {
    expect(isCreditCard("4532-0151-1283-0366")).toBe(true)
    expect(isCreditCard("4532 0151 1283 0366")).toBe(true)
  })

  it("обрабатывает пустую строку", () => {
    expect(isCreditCard("")).toBe(false)
  })
})

describe("isDate", () => {
  it("валидирует правильные даты", () => {
    expect(isDate("2024-01-15")).toBe(true)
    expect(isDate("15.01.2024")).toBe(true)
    expect(isDate("01/15/2024")).toBe(true)
  })

  it("отклоняет неправильные даты", () => {
    expect(isDate("not a date")).toBe(false)
    expect(isDate("2024-13-01")).toBe(false) // несуществующий месяц
    expect(isDate("2024-02-30")).toBe(false) // несуществующий день
  })

  it("обрабатывает пустую строку", () => {
    expect(isDate("")).toBe(false)
  })
})

describe("isIPAddress", () => {
  it("валидирует IPv4 адреса", () => {
    expect(isIPAddress("192.168.1.1")).toBe(true)
    expect(isIPAddress("8.8.8.8")).toBe(true)
    expect(isIPAddress("0.0.0.0")).toBe(true)
    expect(isIPAddress("255.255.255.255")).toBe(true)
  })

  it("отклоняет неправильные IPv4 адреса", () => {
    expect(isIPAddress("256.1.1.1")).toBe(false)
    expect(isIPAddress("1.1.1")).toBe(false)
    expect(isIPAddress("1.1.1.1.1")).toBe(false)
    expect(isIPAddress("abc.def.ghi.jkl")).toBe(false)
  })

  it("валидирует IPv6 адреса", () => {
    expect(isIPAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(true)
    expect(isIPAddress("2001:db8:85a3::8a2e:370:7334")).toBe(true)
    expect(isIPAddress("::1")).toBe(true)
  })

  it("обрабатывает пустую строку", () => {
    expect(isIPAddress("")).toBe(false)
  })
})
