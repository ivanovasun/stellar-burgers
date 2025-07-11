import { rootReducer, store } from './store';
import { expect, test } from '@jest/globals';

describe('проверка rootReducer', () => {
  test('правильно инициализируется rootReducer', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(store.getState());
  });

  test('возвращает правильное начальное состояние при неизвестном типе экшена', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const initialState = store.getState();

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual(initialState);
  });
});
