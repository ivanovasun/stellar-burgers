const selectorIngredientsModule = '[data-cy="ingredients-module"]';
const selectorConstructorModule = '[data-cy="constructor-module"]';
const selectorModal = '[data-cy="modal"]';
const selectorButtonCloseModal = '[data-cy="modal-close"]';
const selectorOverlayModal = '[data-cy="modalOverlay"]';
const ingredientBun = 'Краторная булка N-200i';

describe('тестируем конструктор бургера', () => {
  //настроен перехват запроса на всех эндпоинтах
  beforeEach(() => {
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredientsThunk'
    );

    cy.fixture('order.json').as('orderData');
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'createOrderThunk'
    );

    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUserThunk'
    );
    cy.intercept('POST', '/api/auth/login', { fixture: 'login.json' }).as(
      'loginUserThunk'
    );

    localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.setCookie('accessToken', 'fake-access-token');
    cy.visit('http://localhost:8080/');
  });
  afterEach(() => {
    localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('тестируем добавление ингридиентов через кнопку', () => {
    cy.wait('@getIngredientsThunk');
    cy.get(selectorIngredientsModule)
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    cy.get(selectorConstructorModule).should(
      'contain.text',
      'Краторная булка N-200i'
    );

    cy.get(selectorIngredientsModule)
      .contains('Соус с шипами Антарианского плоскоходца')
      .parent()
      .find('button')
      .click();

    cy.get(selectorConstructorModule).should(
      'contain.text',
      'Соус с шипами Антарианского плоскоходца'
    );
  });

  describe('тестируем модальные окна', () => {
    it('открытие, закрытие модалки', () => {
      cy.wait('@getIngredientsThunk');

      cy.contains(ingredientBun).click();
      cy.get(selectorModal).should('be.visible');

      cy.get(selectorButtonCloseModal).click();
      cy.get(selectorModal).should('not.exist');

      cy.contains(ingredientBun).click();
      cy.get(selectorModal).should('exist');
      cy.get(selectorOverlayModal).click({ force: true });
      cy.get(selectorModal).should('not.exist');
    });
  });

  describe('тестируем создание заказа', () => {
    it('заказ создается и номер есть у заказа, после заказа конструктор пуст', () => {
      cy.wait('@getIngredientsThunk');
      cy.get(selectorIngredientsModule)
        .contains(ingredientBun)
        .parent()
        .find('button')
        .click({ force: true });
      cy.get(selectorIngredientsModule)
        .contains('Соус с шипами Антарианского плоскоходца')
        .parent()
        .find('button')
        .click({ force: true });

      cy.get(selectorConstructorModule)
        .children()
        .last()
        .find('button')
        .click({ force: true });

      cy.wait('@createOrderThunk').its('response.statusCode').should('eq', 200);

      cy.get(selectorModal).should('exist');
      cy.get(selectorModal).should('contain', '57555');

      cy.get(selectorButtonCloseModal).click();
      cy.get(selectorModal).should('not.exist');

      cy.get(selectorConstructorModule)
        .children()
        .first()
        .should('contain.text', 'Выберите булки');
      cy.get(selectorConstructorModule)
        .children()
        .first()
        .next()
        .should('contain.text', 'Выберите начинку');
  });
});
});
