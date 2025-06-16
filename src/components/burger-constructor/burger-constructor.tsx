import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  getOrderLoading,
  getOrder,
  getUser
} from '../../services/chooseOnes';
import {
  createOrderThunk,
  clearConstructor
} from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorItems);
  const orderModalData = useSelector(getOrder); // Получение данных модального окна
  const orderRequest = useSelector(getOrderLoading);
  const user = useSelector(getUser);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!user) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrderThunk(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor()); // Закрытие модального окна
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData} // Добавлено свойство
      closeOrderModal={closeOrderModal} // Добавлено свойство
      onOrderClick={onOrderClick}
    />
  );
};
