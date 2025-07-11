import { expect, test, describe, jest, beforeEach } from '@jest/globals';
import { getFeedsThunk, feedsSlice, initialState } from './feedsSlice';
import { TOrder, TOrdersData } from '@utils-types';

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

const mockFeedsData: TOrdersData = {
  orders: mockOrders,
  total: 108,
  totalToday: 18
};

describe('тесты экстра редюсеров', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('тесты экстра редюсера getFeedsThunk', () => {
    test('проверка pending у getFeedsThunk', () => {
      const action = {
        type: getFeedsThunk.pending.type
      };
      const state = feedsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка reject у getFeedsThunk', () => {
      const errorMessage = 'Ошибка';
      const action = {
        type: getFeedsThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };

      const state = feedsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у getFeedsThunk', () => {
      const action = {
        type: getFeedsThunk.fulfilled.type,
        payload: mockFeedsData
      };
      const state = feedsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockFeedsData.orders);
      expect(state.total).toBe(108);
      expect(state.totalToday).toBe(18);
    });
  });
});
