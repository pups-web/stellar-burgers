import { TConstructorIngredient, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  price: number;
  orderRequest: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderModalData: TOrder | null; // Обязательное свойство
  closeOrderModal: () => void; // Обязательное свойство
  onOrderClick: () => void;
};
