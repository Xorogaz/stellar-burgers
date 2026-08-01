import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BUN_TYPE } from '../../utils/constants';
import { createOrder } from './order-slice';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const constructorInitialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: constructorInitialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === BUN_TYPE) {
          state.bun = action.payload;
          return;
        }
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0) return;
      const [movedIngredient] = state.ingredients.splice(index, 1);
      state.ingredients.splice(index - 1, 0, movedIngredient);
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= state.ingredients.length - 1) return;
      const [movedIngredient] = state.ingredients.splice(index, 1);
      state.ingredients.splice(index + 1, 0, movedIngredient);
    },
    clearConstructor: () => constructorInitialState
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, () => constructorInitialState);
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
export default constructorSlice;
