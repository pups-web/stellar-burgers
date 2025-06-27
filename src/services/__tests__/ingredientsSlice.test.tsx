import { rootReducer } from '../store';
import { ingredientsSlice, fetchIngredients } from '../slices/ingredientsSlice';
import { configureStore } from '@reduxjs/toolkit';

const mockIngredients = [
  { _id: '1', name: 'Булка', type: 'bun', proteins: 10, fat: 5, carbohydrates: 20, calories: 100, price: 50, image: '', image_mobile: '', image_large: '' },
  { _id: '2', name: 'Котлета', type: 'main', proteins: 20, fat: 10, carbohydrates: 30, calories: 200, price: 100, image: '', image_mobile: '', image_large: '' }
];

describe('ingredientsSlice simple tests', () => {
  it('fetchIngredients.fulfilled сохраняет ингредиенты', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockIngredients })
      })
    ) as jest.Mock;

    const store = configureStore({ reducer: rootReducer });
    await store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;
    expect(state.items).toEqual(mockIngredients);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('fetchIngredients.pending выставляет loading в true', () => {
    const initial = { items: [], loading: false, error: null };
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsSlice.reducer(initial, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('fetchIngredients.rejected выставляет loading в false и пишет ошибку', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false, message: 'fail' })
      })
    ) as jest.Mock;

    const store = configureStore({ reducer: rootReducer });
    await store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });
});