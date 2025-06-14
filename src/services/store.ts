import { configureStore, combineReducers } from '@reduxjs/toolkit';
import user from '../services/slices/usersSlice';
import ingredients from '../services/slices/ingredientsSlice';
import feed from '../services/slices/feedSlice';
import burgerConstructor from '../services/slices/constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  user,
  ingredients,
  feed,
  burgerConstructor
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
