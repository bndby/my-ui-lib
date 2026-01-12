import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal, ModalFooter } from "./modal";
import { Button } from "../button/button";

/**
 * Модальное окно для отображения контента поверх основной страницы.
 * Поддерживает различные размеры, блокировку скролла и закрытие по клику/Escape.
 */
const meta = {
  title: "UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      description: "Размер модального окна",
    },
    closeOnOverlayClick: {
      control: "boolean",
      description: "Закрывать по клику на overlay",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Закрывать по нажатию Escape",
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Базовое модальное окно
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть модальное окно</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Модальное окно">
          <p>Это содержимое модального окна.</p>
          <p>Вы можете добавить любой контент сюда.</p>
        </Modal>
      </>
    );
  },
};

/**
 * Модальное окно с футером
 */
export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть с футером</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Подтверждение">
          <p>Вы уверены, что хотите выполнить это действие?</p>
          <p>Это действие нельзя будет отменить.</p>
          <ModalFooter style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsOpen(false);
                alert("Действие подтверждено!");
              }}
            >
              Подтвердить
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Маленькое модальное окно
 */
export const Small: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Маленькое окно</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Маленькое окно" size="sm">
          <p>Это маленькое модальное окно для коротких сообщений.</p>
        </Modal>
      </>
    );
  },
};

/**
 * Среднее модальное окно (по умолчанию)
 */
export const Medium: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Среднее окно</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Среднее окно" size="md">
          <p>Это стандартный размер модального окна.</p>
          <p>Подходит для большинства случаев использования.</p>
        </Modal>
      </>
    );
  },
};

/**
 * Большое модальное окно
 */
export const Large: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Большое окно</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Большое окно" size="lg">
          <p>Это большое модальное окно для контента, требующего больше пространства.</p>
          <p>Здесь может быть много текста или сложных форм.</p>
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#f3f4f6", borderRadius: "6px" }}>
            <p>Пример дополнительного контента в большом модальном окне.</p>
          </div>
        </Modal>
      </>
    );
  },
};

/**
 * Полноэкранное модальное окно
 */
export const FullScreen: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Полноэкранное окно</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Полный экран" size="full">
          <p>Это полноэкранное модальное окно.</p>
          <p>Занимает всю доступную высоту экрана.</p>
          <div style={{ marginTop: "1rem" }}>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Строка контента #{i + 1}</p>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};

/**
 * Без закрытия по клику на overlay
 */
export const NoOverlayClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Открыть (только кнопка закрывает)
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Важное сообщение"
          closeOnOverlayClick={false}
        >
          <p>Это модальное окно нельзя закрыть кликом на фон.</p>
          <p>Используйте кнопку закрытия или кнопку ниже.</p>
          <ModalFooter>
            <Button variant="primary" fullWidth onClick={() => setIsOpen(false)}>
              Понятно
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Без закрытия по Escape
 */
export const NoEscapeClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Открыть (Escape не работает)
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Без Escape"
          closeOnEscape={false}
        >
          <p>Это модальное окно нельзя закрыть клавишей Escape.</p>
          <ModalFooter>
            <Button variant="primary" fullWidth onClick={() => setIsOpen(false)}>
              Закрыть
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Форма в модальном окне
 */
export const FormInModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Форма отправлена!");
      setIsOpen(false);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть форму</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Создать задачу">
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label htmlFor="task-title" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Название задачи
                </label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Введите название"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="task-desc" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Описание
                </label>
                <textarea
                  id="task-desc"
                  placeholder="Введите описание"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
            <ModalFooter style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" variant="primary">
                Создать
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </>
    );
  },
};

/**
 * Вложенные модальные окна
 */
export const Nested: Story = {
  render: () => {
    const [isFirstOpen, setIsFirstOpen] = useState(false);
    const [isSecondOpen, setIsSecondOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsFirstOpen(true)}>Открыть первое окно</Button>
        <Modal isOpen={isFirstOpen} onClose={() => setIsFirstOpen(false)} title="Первое окно">
          <p>Это первое модальное окно.</p>
          <p>Вы можете открыть второе модальное окно поверх этого.</p>
          <Button onClick={() => setIsSecondOpen(true)}>Открыть второе окно</Button>
        </Modal>
        <Modal isOpen={isSecondOpen} onClose={() => setIsSecondOpen(false)} title="Второе окно" size="sm">
          <p>Это второе модальное окно поверх первого.</p>
          <ModalFooter>
            <Button variant="primary" fullWidth onClick={() => setIsSecondOpen(false)}>
              Закрыть
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};
