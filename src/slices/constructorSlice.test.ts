import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState,
  constructorSlice,
  ConstructorState
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';
import { TIngredient } from '@utils-types';
import { v4 } from 'uuid';

const mockMainIngridient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockSauseIngridient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0945',
  name: 'Соус с шипами Антарианского плоскоходца',
  type: 'sauce',
  proteins: 101,
  fat: 99,
  carbohydrates: 100,
  calories: 100,
  price: 88,
  image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
};

const mockIngredients: ConstructorState = {
  bun: null,
  ingredients: [
    { ...mockMainIngridient, id: v4() },
    { ...mockSauseIngridient, id: v4() }
  ]
};

describe('тесты редюсера addIngredient', () => {
  test('добавляет булочку в бургер', () => {
    const action = addIngredient(mockBun);
    const state = constructorSlice.reducer(initialState, action);

    expect(state.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
    expect(state.ingredients).toHaveLength(0);
  });
  test('добавление начинки в бургер', () => {
    const action = addIngredient(mockMainIngridient);
    const state = constructorSlice.reducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...mockMainIngridient,
      id: expect.any(String)
    });
  });
});

describe('тесты редьюсера removeIngredient', () => {
  test('проверка удаления ингридиента по id', () => {
    const action = removeIngredient(mockIngredients.ingredients[0].id);
    const state = constructorSlice.reducer(mockIngredients, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockSauseIngridient._id);
  });
});

describe('тесты редьюсера moveIngredient', () => {
  test('проверяем, что компоненты перемещаются корректно', () => {
    const action = moveIngredient({
      from: 0,
      to: 1
    });
    const state = constructorSlice.reducer(mockIngredients, action);

    expect(state.ingredients[0]._id).toBe(mockSauseIngridient._id);
    expect(state.ingredients[1]._id).toBe(mockMainIngridient._id);
  });
});

describe('тест редьюсера clearConstructor', () => {
  test('должен очищать конструктор', () => {
    const action = clearConstructor();
    const state = constructorSlice.reducer(mockIngredients, action);

    expect(state).toEqual(initialState);
  });
});
