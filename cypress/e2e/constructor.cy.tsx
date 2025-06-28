// Устранение некорректных недочётов

const selectorModals = '#modals';
const selectorOrderButton = '[data-cy="order-button"]';
const selectorOrderPrice = '[data-cy="order-price"]';
const selectorModalOrderNumber = '[data-cy="modal-order-number"]';
const selectorModalOverlay = '[data-cy="modal-overlay"]';
const selectorConstructorTop = '.constructor-element_pos_top span';
const selectorConstructorBottom = '.constructor-element_pos_bottom span';
const selectorConstructorRow = '.constructor-element .constructor-element__row span';



describe('Доступность приложения', () => {
  it('Открывается главная страница', () => {
    // Проверяем, что главная страница доступна
    cy.visit('/');
  });
});

describe('Работа конструктора бургера', () => {
  beforeEach(() => {
    // Загружаем тестовые данные (фикстуры)
    cy.fixture('ingredients').as('ingredients');
    cy.fixture('user').as('user');
    cy.fixture('order').as('order');

    // Мокаем все необходимые запросы к API
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('ingredientsRequest');
    cy.intercept('POST', '**/auth/login', { fixture: 'user.json', statusCode: 201 }).as('loginRequest');
    cy.intercept('POST', '**/orders', { fixture: 'order.json', statusCode: 201 }).as('orderRequest');
    // Перехватываем запросы для получения информации о пользователе он  всегда будет считаться  авторизованным
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json', statusCode: 200 }).as('userInfoRequest');

    // Очищаем куки и localStorage перед каждым тестом
    cy.clearCookies();
    cy.clearLocalStorage();

    // Авторизация пользователя через форму логина
    cy.visit('/login');
    cy.get('@user').then((user: any) => {
      cy.get('input[name="email"]').type(user.user.email);
      cy.get('input[name="password"]').type(user.user.password);
    });
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');

    // После авторизации переходим на главную и ждём загрузки ингредиентов
    cy.visit('/');
    cy.wait('@ingredientsRequest');
  });

  it('Можно добавить ингредиенты в конструктор', () => {
    // Проверяем добавление булки, начинки и соуса в конструктор
    cy.get('@ingredients').then((ingredients: any) => {
      const [bun, main, sauce] = ingredients.data;

      // Добавляем булку
      cy.get(`[data-cy="ingredient-${bun._id}"] button`).click();
      cy.get(selectorConstructorTop).should('contain', `${bun.name} (верх)`);
      cy.get(selectorConstructorBottom).should('contain', `${bun.name} (низ)`);

      // Добавляем начинку
      cy.get(`[data-cy="ingredient-${main._id}"] button`).click();
      cy.get(selectorConstructorRow).should('contain', main.name);

      // Добавляем соус
      cy.get(`[data-cy="ingredient-${sauce._id}"] button`).click();
      cy.get(selectorConstructorRow).should('contain', sauce.name);
    });
  });

  it('Модальное окно ингредиента открывается и закрывается', () => {
    // Проверяем открытие и закрытие модального окна ингредиента
    cy.get('@ingredients').then((ingredients: any) => {
      const bun = ingredients.data[0];

      cy.get(selectorModals).should('be.empty');
      cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
      cy.get(selectorModals).should('not.be.empty');
      cy.get(`${selectorModals} button`).click();
      cy.get(selectorModals).should('be.empty');
      cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
      cy.get(selectorModalOverlay).click({ force: true });
      cy.get(selectorModals).should('be.empty');
    });
  });

  it('Пользователь авторизован', () => {
    // Проверяем, что после логина есть accessToken и refreshToken
    cy.getCookie('accessToken').should('exist');
    cy.window().then(win => {
      expect(win.localStorage.getItem('refreshToken')).to.exist;
    });
  });

  it('Оформление заказа', () => {
    // Проверяем оформление заказа и отображение номера заказа в модалке
    cy.get('@ingredients').then((ingredients: any) => {
      const [bun, main, sauce] = ingredients.data;

      cy.get(selectorModals).should('be.empty');
      cy.get(`[data-cy="ingredient-${bun._id}"] button`).click();
      cy.get(`[data-cy="ingredient-${main._id}"] button`).click();
      cy.get(`[data-cy="ingredient-${sauce._id}"] button`).click();

      // Кликаем по кнопке оформления заказа
      cy.get(selectorOrderButton).click();
      cy.wait('@orderRequest');

      // Проверяем, что модалка открылась и номер заказа совпадает с мок-данными
      cy.get(selectorModals).should('not.be.empty');
      cy.get('@order').then((order: any) => {
        cy.get(selectorModalOrderNumber).should('have.text', order.order.number.toString());
      });

      // Закрываем модалку и проверяем, что цена сброшена
      cy.get(`${selectorModals} button`).click();
      cy.get(selectorModals).should('be.empty');
      cy.get(selectorOrderPrice).should('have.text', '0');
    });
  });
});
  