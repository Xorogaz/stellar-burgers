import {
  fetchIngredients,
  ingredientsInitialState,
  ingredientsReducer
} from '../ingredients-slice';
import { mockIngredients } from './mocks';

const REQUEST_ID = 'test-request-id';
const ERROR_MESSAGE = 'Не удалось загрузить ингредиенты';

describe('Редьюсер слайса ingredients', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(ingredientsInitialState);
  });

  describe('обработка асинхронного экшена fetchIngredients', () => {
    it('pending: включает флаг загрузки и сбрасывает прошлую ошибку', () => {
      const stateWithError = {
        ...ingredientsInitialState,
        ingredientsError: ERROR_MESSAGE
      };

      const state = ingredientsReducer(
        stateWithError,
        fetchIngredients.pending(REQUEST_ID, undefined)
      );

      expect(state.isIngredientsLoading).toBe(true);
      expect(state.ingredientsError).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    it('fulfilled: сохраняет ингредиенты и выключает флаг загрузки', () => {
      const loadingState = {
        ...ingredientsInitialState,
        isIngredientsLoading: true
      };

      const state = ingredientsReducer(
        loadingState,
        fetchIngredients.fulfilled(mockIngredients, REQUEST_ID, undefined)
      );

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredientsError).toBeNull();
    });

    it('rejected: сохраняет текст ошибки и выключает флаг загрузки', () => {
      const loadingState = {
        ...ingredientsInitialState,
        isIngredientsLoading: true
      };

      const state = ingredientsReducer(
        loadingState,
        fetchIngredients.rejected(
          new Error(ERROR_MESSAGE),
          REQUEST_ID,
          undefined
        )
      );

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.ingredientsError).toBe(ERROR_MESSAGE);
      expect(state.ingredients).toEqual([]);
    });
  });
});
