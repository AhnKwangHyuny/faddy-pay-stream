// app/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from '../../features/cart/store/cartSlice';

export const rootReducer = combineReducers({
  cart: cartReducer,
  // 추가 리듀서들을 여기에 등록
});

export type RootState = ReturnType<typeof rootReducer>;