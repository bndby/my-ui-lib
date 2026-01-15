import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

/**
 * Компонент текстового ввода с поддержкой лейблов, ошибок,
 * подсказок и иконок. Полностью совместим с нативными HTML-атрибутами input.
 */
const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Лейбл над полем ввода",
    },
    error: {
      control: "text",
      description: "Текст ошибки",
    },
    hint: {
      control: "text",
      description: "Подсказка под полем",
    },
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Размер поля ввода",
    },
    disabled: {
      control: "boolean",
      description: "Отключить поле",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Базовое поле ввода
 */
export const Default: Story = {
  args: {
    placeholder: "Введите текст...",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с лейблом
 */
export const WithLabel: Story = {
  args: {
    label: "Имя пользователя",
    placeholder: "Введите имя",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с ошибкой
 */
export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "example@email.com",
    error: "Некорректный email адрес",
    defaultValue: "invalid-email",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с подсказкой
 */
export const WithHint: Story = {
  args: {
    label: "Пароль",
    type: "password",
    hint: "Минимум 8 символов, включая цифры и буквы",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с иконкой слева
 */
export const WithLeftIcon: Story = {
  args: {
    label: "Поиск",
    placeholder: "Поиск...",
    leftIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 14L10.5 10.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Поле с иконкой справа
 */
export const WithRightIcon: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "example@email.com",
    rightIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 4L8 8L14 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="2"
          y="3"
          width="12"
          height="10"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Маленький размер
 */
export const Small: Story = {
  args: {
    label: "Маленькое поле",
    placeholder: "Маленькое...",
    inputSize: "sm",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Средний размер (по умолчанию)
 */
export const Medium: Story = {
  args: {
    label: "Среднее поле",
    placeholder: "Среднее...",
    inputSize: "md",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Большой размер
 */
export const Large: Story = {
  args: {
    label: "Большое поле",
    placeholder: "Большое...",
    inputSize: "lg",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Отключенное поле
 */
export const Disabled: Story = {
  args: {
    label: "Отключенное поле",
    placeholder: "Недоступно",
    disabled: true,
    defaultValue: "Значение",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Различные типы полей
 */
export const Types: Story = {
  render: () => (
    <div style={{ width: "350px", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Input label="Текст" type="text" placeholder="Обычный текст" />
      <Input label="Email" type="email" placeholder="example@email.com" />
      <Input label="Пароль" type="password" placeholder="••••••••" />
      <Input label="Число" type="number" placeholder="123" />
      <Input label="Дата" type="date" />
      <Input label="Время" type="time" />
    </div>
  ),
};

/**
 * Форма регистрации
 */
export const RegistrationForm: Story = {
  render: () => (
    <div style={{ width: "400px", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "24px", fontWeight: "600" }}>
        Регистрация
      </h2>
      <Input label="Имя" placeholder="Иван" required />
      <Input label="Фамилия" placeholder="Петров" required />
      <Input
        label="Email"
        type="email"
        placeholder="ivan@example.com"
        hint="Мы никому не передадим ваш email"
        required
      />
      <Input
        label="Пароль"
        type="password"
        hint="Минимум 8 символов"
        required
      />
      <Input
        label="Подтверждение пароля"
        type="password"
        required
      />
    </div>
  ),
};
