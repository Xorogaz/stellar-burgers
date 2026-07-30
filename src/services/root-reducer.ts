import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './slices/constructor-slice';
import { feedReducer } from './slices/feed-slice';
import { ingredientsReducer } from './slices/ingredients-slice';
import { orderReducer } from './slices/order-slice';
import { userOrdersReducer } from './slices/user-orders-slice';
import { userReducer } from './slices/user-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer,
  user: userReducer
});
