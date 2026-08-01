import { expect, Locator, Page, test } from '@playwright/test';

const INGREDIENTS_HAR = 'tests/hars/ingredients.har';
const USER_HAR = 'tests/hars/user.har';
const ORDER_HAR = 'tests/hars/order.har';

const INGREDIENTS_URL = '**/api/ingredients';
const USER_URL = '**/api/auth/user';
const ORDERS_URL = '**/api/orders';

const EMPTY_BUNS_TEXT = 'Выберите булки';
const EMPTY_MAINS_TEXT = 'Выберите начинку';
const INGREDIENT_MODAL_TITLE = 'Детали ингредиента';
const ORDER_MODAL_TEXT = 'идентификатор заказа';

const MOCK_ACCESS_TOKEN = 'Bearer mock-access-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

const MOCK_ORDER_NUMBER = 12345;
const MOCK_USER_NAME = 'Тестовый пользователь';

type TIngredientFixture = {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
};

const mockBun: TIngredientFixture = {
  id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  calories: 420,
  proteins: 80,
  fat: 24,
  carbohydrates: 53
};

const mockSecondBun: TIngredientFixture = {
  id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  calories: 643,
  proteins: 44,
  fat: 26,
  carbohydrates: 85
};

const mockMain: TIngredientFixture = {
  id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  calories: 4242,
  proteins: 420,
  fat: 142,
  carbohydrates: 242
};

const mockSauce: TIngredientFixture = {
  id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  calories: 30,
  proteins: 30,
  fat: 20,
  carbohydrates: 40
};

const getIngredientsSection = (page: Page): Locator =>
  page.locator('section').first();

const getConstructorSection = (page: Page): Locator =>
  page.locator('section').nth(1);

const getIngredientCard = (page: Page, name: string): Locator =>
  getIngredientsSection(page).locator('li').filter({ hasText: name });

const getIngredientCounter = (
  page: Page,
  name: string,
  count: number
): Locator =>
  getIngredientCard(page, name).getByText(String(count), {
    exact: true
  });

const addIngredient = async (page: Page, name: string): Promise<void> => {
  await getIngredientCard(page, name)
    .getByRole('button', { name: 'Добавить' })
    .click();
};

const getModals = (page: Page): Locator => page.locator('#modals');

const getModalOverlay = (page: Page): Locator =>
  getModals(page).locator(':scope > div').last();

const openIngredientModal = async (page: Page, name: string): Promise<void> => {
  await getIngredientCard(page, name).getByRole('link').click();
};

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(INGREDIENTS_HAR, {
    url: INGREDIENTS_URL,
    update: false
  });

  await page.goto('/');
});

test.describe('Конструктор бургера: добавление ингредиентов в заказ', () => {
  test('список ингредиентов приходит из перехваченного запроса', async ({
    page
  }) => {
    await expect(page.getByText(mockBun.name)).toBeVisible();
    await expect(page.getByText(mockMain.name)).toBeVisible();
    await expect(page.getByText(mockSauce.name)).toBeVisible();
  });

  test('булка добавляется одновременно в верх и низ конструктора', async ({
    page
  }) => {
    const burgerConstructor = getConstructorSection(page);

    await expect(burgerConstructor.getByText(EMPTY_BUNS_TEXT)).toHaveCount(2);

    await addIngredient(page, mockBun.name);

    await expect(
      burgerConstructor.getByText(`${mockBun.name} (верх)`)
    ).toBeVisible();
    await expect(
      burgerConstructor.getByText(`${mockBun.name} (низ)`)
    ).toBeVisible();
    await expect(burgerConstructor.getByText(EMPTY_BUNS_TEXT)).toHaveCount(0);
  });

  test('новая булка заменяет ранее выбранную', async ({ page }) => {
    const burgerConstructor = getConstructorSection(page);

    await addIngredient(page, mockBun.name);
    await addIngredient(page, mockSecondBun.name);

    await expect(
      burgerConstructor.getByText(`${mockSecondBun.name} (верх)`)
    ).toBeVisible();
    await expect(
      burgerConstructor.getByText(`${mockBun.name} (верх)`)
    ).toHaveCount(0);
  });

  test('начинка и соус добавляются в середину конструктора', async ({
    page
  }) => {
    const burgerConstructor = getConstructorSection(page);

    await expect(burgerConstructor.getByText(EMPTY_MAINS_TEXT)).toBeVisible();

    await addIngredient(page, mockMain.name);
    await addIngredient(page, mockSauce.name);

    await expect(burgerConstructor.getByText(mockMain.name)).toBeVisible();
    await expect(burgerConstructor.getByText(mockSauce.name)).toBeVisible();
    await expect(burgerConstructor.getByText(EMPTY_MAINS_TEXT)).toHaveCount(0);
  });

  test('счётчик в карточке растёт при каждом добавлении', async ({ page }) => {
    await addIngredient(page, mockMain.name);
    await expect(getIngredientCounter(page, mockMain.name, 1)).toBeVisible();

    await addIngredient(page, mockMain.name);
    await expect(getIngredientCounter(page, mockMain.name, 2)).toBeVisible();
  });
});

test.describe('Конструктор бургера: модальное окно с описанием ингредиента', () => {
  const modalCases = [
    { clicked: mockBun, other: mockMain },
    { clicked: mockMain, other: mockBun }
  ];

  modalCases.forEach(({ clicked, other }) => {
    test(`открывается по клику и показывает данные ингредиента «${clicked.name}», а не другого`, async ({
      page
    }) => {
      const modals = getModals(page);

      await openIngredientModal(page, clicked.name);

      await expect(page).toHaveURL(`/ingredients/${clicked.id}`);
      await expect(modals.getByText(INGREDIENT_MODAL_TITLE)).toBeVisible();
      await expect(modals.getByText(clicked.name)).toBeVisible();
      await expect(
        modals.getByText(String(clicked.calories), { exact: true })
      ).toBeVisible();
      await expect(
        modals.getByText(String(clicked.proteins), { exact: true })
      ).toBeVisible();
      await expect(
        modals.getByText(String(clicked.fat), { exact: true })
      ).toBeVisible();
      await expect(
        modals.getByText(String(clicked.carbohydrates), { exact: true })
      ).toBeVisible();
      await expect(modals.getByText(other.name)).toHaveCount(0);
    });
  });

  test('закрывается по клику на крестик', async ({ page }) => {
    const modals = getModals(page);

    await openIngredientModal(page, mockMain.name);
    await expect(modals.getByText(INGREDIENT_MODAL_TITLE)).toBeVisible();

    await modals.getByRole('button').click();

    await expect(modals).toBeEmpty();
    await expect(page).toHaveURL('/');
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    const modals = getModals(page);

    await openIngredientModal(page, mockMain.name);
    await expect(modals.getByText(INGREDIENT_MODAL_TITLE)).toBeVisible();

    await getModalOverlay(page).click({ position: { x: 10, y: 10 } });

    await expect(modals).toBeEmpty();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Конструктор бургера: оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: MOCK_ACCESS_TOKEN,
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript((token: string) => {
      window.localStorage.setItem('refreshToken', token);
    }, MOCK_REFRESH_TOKEN);

    await page.routeFromHAR(USER_HAR, { url: USER_URL, update: false });
    await page.routeFromHAR(ORDER_HAR, { url: ORDERS_URL, update: false });

    await page.reload();
  });

  test('заказ оформляется, номер верный, конструктор очищается', async ({
    page
  }) => {
    const burgerConstructor = getConstructorSection(page);
    const modals = getModals(page);

    await expect(page.getByText(MOCK_USER_NAME)).toBeVisible();

    await addIngredient(page, mockBun.name);
    await addIngredient(page, mockMain.name);
    await addIngredient(page, mockSauce.name);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(modals.getByText(ORDER_MODAL_TEXT)).toBeVisible();
    await expect(
      modals.getByText(String(MOCK_ORDER_NUMBER), { exact: true })
    ).toBeVisible();

    await expect(burgerConstructor.getByText(EMPTY_BUNS_TEXT)).toHaveCount(2);
    await expect(burgerConstructor.getByText(EMPTY_MAINS_TEXT)).toBeVisible();
    await expect(burgerConstructor.getByText(mockMain.name)).toHaveCount(0);

    await modals.getByRole('button').click();
    await expect(modals).toBeEmpty();
  });
});
