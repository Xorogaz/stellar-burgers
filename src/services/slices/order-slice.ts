import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
  orderError: string | null;
};

export const orderInitialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  orderError: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  (ingredientIds: string[]) => orderBurgerApi(ingredientIds)
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  (orderNumber: number) => getOrderByNumberApi(orderNumber)
);

const orderSlice = createSlice({
  name: 'order',
  initialState: orderInitialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = {
          ...action.payload.order,
          ingredients: action.meta.arg
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message ?? null;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderByNumber = null;
        state.orderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload.orders[0] ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderError = action.error.message ?? null;
      });
  }
});

export const { clearOrderModalData, clearOrderByNumber } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
export default orderSlice;
