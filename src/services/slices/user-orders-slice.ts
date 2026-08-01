import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export type TUserOrdersState = {
  orders: TOrder[];
  isUserOrdersLoading: boolean;
  userOrdersError: string | null;
};

export const userOrdersInitialState: TUserOrdersState = {
  orders: [],
  isUserOrdersLoading: false,
  userOrdersError: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  getOrdersApi
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState: userOrdersInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isUserOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isUserOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isUserOrdersLoading = false;
        state.userOrdersError = action.error.message ?? null;
      });
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;
export default userOrdersSlice;
