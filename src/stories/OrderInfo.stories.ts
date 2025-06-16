import { OrderInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/OrderInfo',
  component: OrderInfoUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OrderInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOrderInfo: Story = {
  args: {
    orderNumber: 2, // Номер заказа
    burgerName: 'Order', // Название бургера
    orderStatus: 'ready', // Статус заказа
    ingredientsInfo: {
      bun: {
        _id: '211',
        name: 'Булка',
        type: 'bun',
        proteins: 12,
        fat: 23,
        carbohydrates: 45,
        calories: 56,
        price: 67,
        image: '',
        image_large: '',
        image_mobile: '',
        count: 2
      }
    },
    date: new Date('2024-01-25'), // Дата заказа
    total: 134 // Общая стоимость
  }
};
