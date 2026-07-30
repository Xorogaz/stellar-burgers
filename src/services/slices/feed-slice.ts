import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isFeedLoading: boolean;
  feedError: string | null;
};

export const feedInitialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isFeedLoading: false,
  feedError: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState: feedInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isFeedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.feedError = action.error.message ?? null;
      });
  }
});

export const feedReducer = feedSlice.reducer;
export default feedSlice;
