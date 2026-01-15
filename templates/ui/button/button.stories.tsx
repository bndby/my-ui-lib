import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

/**
 * Универсальный компонент кнопки с различными вариантами стилей,
 * размерами и состояниями. Поддерживает иконки и индикатор загрузки.
 */
const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
      description: "Вариант стиля кнопки",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Размер кнопки",
    },
    isLoading: {
      control: "boolean",
      description: "Показывать индикатор загрузки",
    },
    fullWidth: {
      control: "boolean",
      description: "Растянуть кнопку на всю ширину",
    },
    disabled: {
      control: "boolean",
      description: "Отключить кнопку",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Основной вариант кнопки с синим фоном
 */
export const Primary: Story = {
  args: {
    children: "Кнопка",
    variant: "primary",
  },
};

/**
 * Вторичная кнопка с серым фоном
 */
export const Secondary: Story = {
  args: {
    children: "Вторичная кнопка",
    variant: "secondary",
  },
};

/**
 * Кнопка с обводкой без заливки
 */
export const Outline: Story = {
  args: {
    children: "Обводка",
    variant: "outline",
  },
};

/**
 * Прозрачная кнопка без фона
 */
export const Ghost: Story = {
  args: {
    children: "Призрак",
    variant: "ghost",
  },
};

/**
 * Кнопка для опасных действий (красная)
 */
export const Danger: Story = {
  args: {
    children: "Удалить",
    variant: "danger",
  },
};

/**
 * Маленький размер кнопки
 */
export const Small: Story = {
  args: {
    children: "Маленькая",
    size: "sm",
  },
};

/**
 * Средний размер кнопки (по умолчанию)
 */
export const Medium: Story = {
  args: {
    children: "Средняя",
    size: "md",
  },
};

/**
 * Большой размер кнопки
 */
export const Large: Story = {
  args: {
    children: "Большая",
    size: "lg",
  },
};

/**
 * Кнопка с индикатором загрузки
 */
export const Loading: Story = {
  args: {
    children: "Загрузка",
    isLoading: true,
  },
};

/**
 * Отключенная кнопка
 */
export const Disabled: Story = {
  args: {
    children: "Отключена",
    disabled: true,
  },
};

/**
 * Кнопка с иконкой слева
 */
export const WithLeftIcon: Story = {
  args: {
    children: "С иконкой",
    leftIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 3V13M3 8H13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

/**
 * Кнопка с иконкой справа
 */
export const WithRightIcon: Story = {
  args: {
    children: "Далее",
    rightIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3L11 8L6 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

/**
 * Кнопка на всю ширину контейнера
 */
export const FullWidth: Story = {
  args: {
    children: "Полная ширина",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Набор всех вариантов кнопок
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

/**
 * Набор всех размеров кнопок
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
