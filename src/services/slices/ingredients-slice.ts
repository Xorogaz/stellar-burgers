import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  ingredientsError: string | null;
};

export const ingredientsInitialState: TIngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  ingredientsError: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: ingredientsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.ingredientsError = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredientsError = action.error.message ?? null;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export default ingredientsSlice;
