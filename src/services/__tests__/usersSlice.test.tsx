import { rootReducer } from '../store';
import {
  addIngredient,
  upIngredient,
  downIngredient,
  removeIngredient,
  createOrderThunk,
  constructorSlice
} from '../slices/constructorSlice';
import * as cookieUtils from '../../utils/cookie';
import { configureStore } from '@reduxjs/toolkit';

const testIngredients = [
  {
    id: 'id1',
    _id: 'id1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    id: 'id2',
    _id: 'id2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

const fakeOrder = {
    success: true,
  order: {
    _id: 'orderid',
    ingredients: ['id1', 'id2'],
    status: 'done',
    name: 'Тестовый бургер',
    createdAt: '2025-06-10T10:43:11.158Z',
    updatedAt: '2025-06-10T10:43:12.253Z',
    number: 12345
  },
  name: 'Тестовый бургер'
};

describe('constructorSlice alternative tests', () => {
  it('должен добавлять ингредиент в конструктор', () => {
    let state = rootReducer(undefined, { type: 'init' });
    state = rootReducer(state, addIngredient(testIngredients[0]));
    expect(state.burgerConstructor.ingredients).toContainEqual(testIngredients[0]);
  });

  it('должен удалять ингредиент из конструктора', () => {
    let state = rootReducer(undefined, { type: 'init' });
    state = rootReducer(state, addIngredient(testIngredients[0]));
    state = rootReducer(state, removeIngredient(testIngredients[0]));
    expect(state.burgerConstructor.ingredients).not.toContainEqual(testIngredients[0]);
  });

  it('перемещает ингредиенты вверх и вниз', () => {
    let state = rootReducer(undefined, { type: 'init' });
    state = rootReducer(state, addIngredient(testIngredients[0]));
    state = rootReducer(state, addIngredient(testIngredients[1]));
    // вниз
    state = rootReducer(state, downIngredient(0));
    expect(state.burgerConstructor.ingredients[0]).toEqual(testIngredients[1]);
    expect(state.burgerConstructor.ingredients[1]).toEqual(testIngredients[0]);
    // вверх
    state = rootReducer(state, upIngredient(1));
    expect(state.burgerConstructor.ingredients[0]).toEqual(testIngredients[0]);
    expect(state.burgerConstructor.ingredients[1]).toEqual(testIngredients[1]);
  });

  it('корректно оформляет заказ', async () => {
    jest.spyOn(cookieUtils, 'getCookie').mockReturnValue('token');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeOrder)
      })
    ) as jest.Mock;

    const store = configureStore({ reducer: rootReducer });
    await store.dispatch(createOrderThunk(['id1', 'id2']));
    const state = store.getState().burgerConstructor;
    expect(state.order).toEqual(fakeOrder.order);
    expect(state.orderName).toBe(fakeOrder.name);
    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('createOrderThunk.pending выставляет isOrderLoading в true', () => {
    const initial = {
      bun: null,
      ingredients: [],
      order: null,
      orderName: null,
      isOrderLoading: false,
      error: null
    };
    const action = { type: createOrderThunk.pending.type };
    const state = constructorSlice.reducer(initial, action);
    expect(state.isOrderLoading).toBe(true);
  });

  it('createOrderThunk.rejected выставляет isOrderLoading в false и пишет ошибку', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false, message: 'fail' })
      })
    ) as jest.Mock;

    const store = configureStore({ reducer: rootReducer });
    await store.dispatch(createOrderThunk(['id1', 'id2']));
    const state = store.getState().burgerConstructor;
    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBeTruthy();
  });
});