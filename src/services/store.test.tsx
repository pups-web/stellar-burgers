import { rootReducer } from './store';
import userReducer from './slices/usersSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import feedReducer from './slices/feedSlice';
import burgerConstructorReducer from './slices/constructorSlice';

describe('тест rootReducer', () => {
  test(' корректная инициализация', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('burgerConstructor');

    expect(initialState.user).toEqual(
      userReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.feed).toEqual(
      feedReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.burgerConstructor).toEqual(
      burgerConstructorReducer(undefined, { type: '@@INIT' })
    );
  });
});
