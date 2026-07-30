import { RootState } from '../store';

/* Ингредиенты */
export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.ingredientsError;

export const selectIngredientById =
  (ingredientId: string) => (state: RootState) =>
    state.ingredients.ingredients.find(
      (ingredient) => ingredient._id === ingredientId
    ) ?? null;

/* Конструктор бургера */
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

/* Заказ */
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const selectOrderByNumber = (state: RootState) =>
  state.order.orderByNumber;

/* Лента заказов */
export const selectFeed = (state: RootState) => state.feed;

export const selectFeedOrders = (state: RootState) => state.feed.orders;

export const selectFeedLoading = (state: RootState) => state.feed.isFeedLoading;

/* История заказов пользователя */
export const selectUserOrders = (state: RootState) => state.userOrders.orders;

export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.isUserOrdersLoading;

/* Пользователь */
export const selectUser = (state: RootState) => state.user.user;

export const selectUserName = (state: RootState) => state.user.user?.name;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.user);

export const selectUserError = (state: RootState) => state.user.userError;
