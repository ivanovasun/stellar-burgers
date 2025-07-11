import { expect, test } from '@jest/globals';
import {
  ingredientsSlice,
  getIngredientsThunk,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('тесты экстра редюсера', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('тесты экстра редюсера getFeedsThunk', () => {
    test('проверка pending у getIngredientsThunk', () => {
      const action = {
        type: getIngredientsThunk.pending.type
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isIngredientsLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка reject у getIngredientsThunk', () => {
      const errorMessage = 'Ошибка';
      const action = {
        type: getIngredientsThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };

      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у getIngredientsThunk', () => {
      const action = {
        type: getIngredientsThunk.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });
  });
});
