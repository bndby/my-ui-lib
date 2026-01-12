import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "../button/button";

/**
 * Контейнер карточки с различными вариантами стилей.
 * Поддерживает составные компоненты для структуры контента.
 */
const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "elevated"],
      description: "Вариант стиля карточки",
    },
    noPadding: {
      control: "boolean",
      description: "Убрать внутренние отступы",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Базовая карточка с заголовком и контентом
 */
export const Default: Story = {
  render: () => (
    <Card style={{ width: "350px" }}>
      <CardHeader>
        <CardTitle>Заголовок карточки</CardTitle>
        <CardDescription>Описание карточки</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Это содержимое карточки. Здесь может быть любой контент, который вам
          нужен.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Карточка с обводкой
 */
export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" style={{ width: "350px" }}>
      <CardHeader>
        <CardTitle>Обведенная карточка</CardTitle>
        <CardDescription>Карточка с четкой границей</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Эта карточка имеет видимую границу вместо тени.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Карточка с тенью
 */
export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" style={{ width: "350px" }}>
      <CardHeader>
        <CardTitle>Приподнятая карточка</CardTitle>
        <CardDescription>Карточка с выраженной тенью</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Эта карточка имеет более выраженную тень для создания эффекта глубины.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Полная карточка с заголовком, контентом и футером
 */
export const WithFooter: Story = {
  render: () => (
    <Card style={{ width: "350px" }}>
      <CardHeader>
        <CardTitle>Карточка с футером</CardTitle>
        <CardDescription>Полная структура карточки</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Эта карточка содержит все компоненты: заголовок, описание, контент и
          футер с кнопками действий.
        </p>
      </CardContent>
      <CardFooter style={{ display: "flex", gap: "0.5rem" }}>
        <Button variant="primary" size="sm">
          Принять
        </Button>
        <Button variant="outline" size="sm">
          Отменить
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Карточка без внутренних отступов
 */
export const NoPadding: Story = {
  render: () => (
    <Card noPadding style={{ width: "350px" }}>
      <div
        style={{
          width: "100%",
          height: "200px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />
      <div style={{ padding: "1rem" }}>
        <CardTitle>Карточка без отступов</CardTitle>
        <CardDescription style={{ marginTop: "0.5rem" }}>
          Полезно для изображений и медиа-контента
        </CardDescription>
      </div>
    </Card>
  ),
};

/**
 * Карточка профиля пользователя
 */
export const UserProfile: Story = {
  render: () => (
    <Card style={{ width: "350px" }}>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            ИП
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              Иван Петров
            </h3>
            <p style={{ margin: "0.25rem 0 0", color: "#6b7280", fontSize: "14px" }}>
              ivan@example.com
            </p>
          </div>
        </div>
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "600" }}>128</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Публикации</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "600" }}>1.2k</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Подписчики</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "600" }}>234</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Подписки</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" fullWidth>
          Подписаться
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Сетка карточек
 */
export const Grid: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
      {["default", "outlined", "elevated"].map((variant, i) => (
        <Card
          key={i}
          variant={variant as "default" | "outlined" | "elevated"}
          style={{ width: "250px" }}
        >
          <CardHeader>
            <CardTitle>Карточка {i + 1}</CardTitle>
            <CardDescription>Вариант: {variant}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Пример контента карточки с различными вариантами стилей.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
