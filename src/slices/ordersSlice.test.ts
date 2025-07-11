import { expect, test, describe, jest, beforeEach } from '@jest/globals';
import {
  clearCurrentOrder,
  getOrdersThunk,
  createOrderThunk,
  getOrderByNumberThunk,
  initialState,
  ordersSlice
} from './ordersSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-11',
    number: 1,
    ingredients: ['ing1', 'ing2']
  },
  {
    _id: '2',
    status: 'pending',
    name: 'Order 2',
    createdAt: '2025-01-12',
    updatedAt: '2025-01-13',
    number: 2,
    ingredients: ['ing3', 'ing4']
  }
];

const mockOrder: TOrder = {
  _id: '3',
  status: 'done',
  name: 'Order 3',
  createdAt: '2025-01-17',
  updatedAt: '2025-01-18',
  number: 3,
  ingredients: ['ing5', 'ing6']
};

describe('тесты редюсера clearCurrentOrder', () => {
  test('проверка очистки заказа', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: mockOrder
    };
    const action = clearCurrentOrder();
    const state = ordersSlice.reducer(stateWithOrder, action);

    expect(state.orderModalData).toBeNull();
  });
});

describe('тесты экстра редюсеров', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('тесты экстра редюсера getOrdersThunk', () => {
    test('проверка pending у getOrdersThunk', () => {
      const action = {
        type: getOrdersThunk.pending.type
      };
      const state = ordersSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у getOrdersThunk', () => {
      const errorMessage = 'заказы не загрузились';
      const action = {
        type: getOrdersThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = ordersSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у getOrdersThunk', () => {
      const action = {
        type: getOrdersThunk.fulfilled.type,
        payload: mockOrders
      };
      const state = ordersSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orders).toEqual(mockOrders);
    });
  });

  describe('тесты экстра редюсера createOrderThunk', () => {
    test('проверка pending у createOrderThunk', () => {
      const action = {
        type: createOrderThunk.pending.type
      };
      const state = ordersSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у createOrderThunk', () => {
      const errorMessage = 'ошибка при создании заказа';
      const action = {
        type: createOrderThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = ordersSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у createOrderThunk', () => {
      const action = {
        type: createOrderThunk.fulfilled.type,
        payload: {
          order: mockOrder
        }
      };
      const state = ordersSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });
  });
  describe('тесты экстра редюсера getOrderByNumberThunk', () => {
    test('проверка pending у getOrderByNumberThunk', () => {
      const action = {
        type: getOrderByNumberThunk.pending.type
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у getOrderByNumberThunk', () => {
      const errorMessage = 'не найдено';
      const action = {
        type: getOrderByNumberThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у getOrderByNumberThunk', () => {
      const action = {
        type: getOrderByNumberThunk.fulfilled.type,
        payload: mockOrder
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });
  });
});
