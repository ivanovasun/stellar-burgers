const IngredientsModule = '[data-cy="ingredients-module"]';
const ConstructorModule = '[data-cy="constructor-module"]';
const Modal = '[data-cy="modal"]';
const ButtonCloseModal = '[data-cy="modal-close"]';
const OverlayModal = '[data-cy="modalOverlay"]';
const IngredientBun = 'Краторная булка N-200i';
const testURL = 'http://localhost:8080/';

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
    cy.visit(testURL);
  });
  afterEach(() => {
    localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('тестируем добавление ингридиентов через кнопку', () => {
    cy.wait('@getIngredientsThunk');
    cy.get(IngredientsModule).contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    cy.get(ConstructorModule).should('contain.text', 'Краторная булка N-200i');

    cy.get(IngredientsModule).contains('Соус с шипами Антарианского плоскоходца')
      .parent()
      .find('button')
      .click();

    cy.get(ConstructorModule).should(
      'contain.text',
      'Соус с шипами Антарианского плоскоходца'
    );
  });

  describe('тестируем модальные окна', () => {
    it('открытие, закрытие модалки', () => {
      cy.wait('@getIngredientsThunk');

      cy.contains(IngredientBun).click();
      cy.get(Modal).should('be.visible');

      cy.get(ButtonCloseModal).click();
      cy.get(Modal).should('not.exist');

      cy.contains(IngredientBun).click();
      cy.get(Modal).should('exist');
      cy.get(OverlayModal).click({ force: true });
      cy.get(Modal).should('not.exist');
    });
});

describe('тестируем создание заказа', () => {
    it('заказ создается и номер есть у заказа, после заказа конструктор пуст', () => {
      cy.wait('@getIngredientsThunk');
      cy.get(IngredientsModule)
        .contains(IngredientBun)
        .parent().find('button')
        .click({ force: true });
      cy.get(IngredientsModule)
        .contains('Соус с шипами Антарианского плоскоходца')
        .parent()
        .find('button')
        .click({ force: true });

      cy.get(ConstructorModule)
        .children()
        .last()
        .find('button')
        .click({ force: true });

      cy.wait('@createOrderThunk').its('response.statusCode').should('eq', 200);

      cy.get(Modal).should('exist');
      cy.get(Modal).should('contain', '57555');

      cy.get(ButtonCloseModal).click();
      cy.get(Modal).should('not.exist');

      cy.get(ConstructorModule)
        .children()
        .first()
        .should('contain.text', 'Выберите булки');
      cy.get(ConstructorModule)
        .children()
        .first()
        .next()
        .should('contain.text', 'Выберите начинку');
    });
});
});
