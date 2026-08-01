import {
  addIngredient,
  clearConstructor,
  constructorInitialState,
  constructorReducer,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../constructor-slice';
import { createOrder } from '../order-slice';
import {
  mockBun,
  mockConstructorMain,
  mockConstructorSauce,
  mockMain,
  mockNewOrderResponse,
  mockSecondBun
} from './mocks';

const MOCK_UUID = 'mock-uuid';

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

const REQUEST_ID = 'test-request-id';
const ORDER_INGREDIENT_IDS = [mockBun._id, mockMain._id, mockBun._id];

const filledState = {
  bun: { ...mockBun, id: 'constructor-bun-id' },
  ingredients: [mockConstructorMain, mockConstructorSauce]
};

describe('Редьюсер слайса burgerConstructor', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(constructorInitialState);
  });

  describe('экшен addIngredient', () => {
    it('кладёт булку в поле bun и добавляет ей уникальный id', () => {
      const state = constructorReducer(
        constructorInitialState,
        addIngredient(mockBun)
      );

      expect(state.bun).toEqual({ ...mockBun, id: MOCK_UUID });
      expect(state.ingredients).toEqual([]);
    });

    it('заменяет ранее выбранную булку новой', () => {
      const stateWithBun = constructorReducer(
        constructorInitialState,
        addIngredient(mockBun)
      );

      const state = constructorReducer(
        stateWithBun,
        addIngredient(mockSecondBun)
      );

      expect(state.bun).toEqual({ ...mockSecondBun, id: MOCK_UUID });
    });

    it('добавляет начинку в конец списка ингредиентов', () => {
      const stateWithBun = constructorReducer(
        constructorInitialState,
        addIngredient(mockBun)
      );

      const state = constructorReducer(stateWithBun, addIngredient(mockMain));

      expect(state.ingredients).toEqual([{ ...mockMain, id: MOCK_UUID }]);
      expect(state.bun).toEqual({ ...mockBun, id: MOCK_UUID });
    });
  });

  describe('экшен removeIngredient', () => {
    it('удаляет ингредиент с переданным id', () => {
      const state = constructorReducer(
        filledState,
        removeIngredient(mockConstructorMain.id)
      );

      expect(state.ingredients).toEqual([mockConstructorSauce]);
      expect(state.bun).toEqual(filledState.bun);
    });

    it('не меняет список, если ингредиента с таким id нет', () => {
      const state = constructorReducer(
        filledState,
        removeIngredient('unknown-id')
      );

      expect(state.ingredients).toEqual(filledState.ingredients);
    });
  });

  describe('экшены перемещения ингредиентов', () => {
    it('moveIngredientUp поднимает ингредиент на позицию выше', () => {
      const state = constructorReducer(filledState, moveIngredientUp(1));

      expect(state.ingredients).toEqual([
        mockConstructorSauce,
        mockConstructorMain
      ]);
    });

    it('moveIngredientUp не меняет порядок для первого ингредиента', () => {
      const state = constructorReducer(filledState, moveIngredientUp(0));

      expect(state.ingredients).toEqual(filledState.ingredients);
    });

    it('moveIngredientDown опускает ингредиент на позицию ниже', () => {
      const state = constructorReducer(filledState, moveIngredientDown(0));

      expect(state.ingredients).toEqual([
        mockConstructorSauce,
        mockConstructorMain
      ]);
    });

    it('moveIngredientDown не меняет порядок для последнего ингредиента', () => {
      const state = constructorReducer(filledState, moveIngredientDown(1));

      expect(state.ingredients).toEqual(filledState.ingredients);
    });
  });

  it('экшен clearConstructor очищает конструктор', () => {
    const state = constructorReducer(filledState, clearConstructor());

    expect(state).toEqual(constructorInitialState);
  });

  describe('обработка асинхронного экшена createOrder', () => {
    it('pending: оставляет содержимое конструктора без изменений', () => {
      const state = constructorReducer(
        filledState,
        createOrder.pending(REQUEST_ID, ORDER_INGREDIENT_IDS)
      );

      expect(state).toEqual(filledState);
    });

    it('fulfilled: очищает конструктор после успешного заказа', () => {
      const state = constructorReducer(
        filledState,
        createOrder.fulfilled(
          mockNewOrderResponse,
          REQUEST_ID,
          ORDER_INGREDIENT_IDS
        )
      );

      expect(state).toEqual(constructorInitialState);
    });

    it('rejected: оставляет содержимое конструктора без изменений', () => {
      const state = constructorReducer(
        filledState,
        createOrder.rejected(
          new Error('Не удалось оформить заказ'),
          REQUEST_ID,
          ORDER_INGREDIENT_IDS
        )
      );

      expect(state).toEqual(filledState);
    });
  });
});
