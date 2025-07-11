import { expect, test, describe, jest, beforeEach } from '@jest/globals';
import {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  getUserThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  init,
  clearAuthTokens,
  resetPasswordState,
  initialState,
  userSlice
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@test.ru',
  name: 'TestUser'
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
};

describe('проверка редьюсеров userSlice', () => {
  test('проверка правильности состояния init', () => {
    const action = init();
    const state = userSlice.reducer(initialState, action);
    expect(state.isInit).toBe(true);
  });

  test('проверка очиски токенов clearAuthTokens', () => {
    const stateWithTokens = {
      ...initialState,
      auth: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      }
    };
    const action = clearAuthTokens();
    const state = userSlice.reducer(stateWithTokens, action);
    expect(state.auth.accessToken).toBeNull();
    expect(state.auth.refreshToken).toBeNull();
  });

  test('проверка сброса пароля resetPasswordState', () => {
    const stateWithReset = {
      ...initialState,
      passwordReset: {
        emailSent: true,
        resetSuccessful: true
      }
    };
    const action = resetPasswordState();
    const state = userSlice.reducer(stateWithReset, action);
    expect(state.passwordReset.emailSent).toBe(false);
    expect(state.passwordReset.resetSuccessful).toBe(false);
  });
});

describe('проверка экстра редьюсеров userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('проверка возможности залогониться loginUserThunk', () => {
    test('проверка pending у loginUserThunk', () => {
      const action = {
        type: loginUserThunk.pending.type
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у loginUserThunk', () => {
      const errorMessage = 'шибка логина';
      const action = {
        type: loginUserThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у loginUserThunk', () => {
      const action = {
        type: loginUserThunk.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.auth.accessToken).toBe('access-token');
      expect(state.auth.refreshToken).toBe('refresh-token');
    });
  });

  describe('проверка экстра редьюсера getUserThunk', () => {
    test('проверка pending у getUserThunk', () => {
      const action = {
        type: getUserThunk.pending.type
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у getUserThunk', () => {
      const errorMessage = 'ошибка получения юзера';
      const action = {
        type: getUserThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isInit).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у getUserThunk', () => {
      const action = {
        type: getUserThunk.fulfilled.type,
        payload: {
          user: mockUser
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isInit).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('проверка экстра редьюсера registerUserThunk', () => {
    test('проверка pending у registerUserThunk', () => {
      const action = {
        type: registerUserThunk.pending.type
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у registerUserThunk', () => {
      const errorMessage = 'ошибка регистрации';
      const action = {
        type: registerUserThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у registerUserThunk', () => {
      const action = {
        type: registerUserThunk.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.auth.accessToken).toBe('access-token');
      expect(state.auth.refreshToken).toBe('refresh-token');
    });
  });

  describe('проверка экстра редьюсера logoutUserThunk', () => {
    test('проверка pending у logoutUserThunk', () => {
      const action = {
        type: logoutUserThunk.pending.type
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у logoutUserThunk', () => {
      const errorMessage = 'ошибка логаута';
      const action = {
        type: logoutUserThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у logoutUserThunk', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        auth: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      };
      const action = {
        type: logoutUserThunk.fulfilled.type,
        payload: undefined
      };
      const state = userSlice.reducer(stateWithUser, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.auth.accessToken).toBeNull();
      expect(state.auth.refreshToken).toBeNull();
    });
  });

  describe('проверка экстра редьюсера updateUserThunk', () => {
    test('проверка pending у updateUserThunk', () => {
      const action = {
        type: updateUserThunk.pending.type
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('проверка rejected у updateUserThunk', () => {
      const errorMessage = 'ошибка изменения данных';
      const action = {
        type: updateUserThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у updateUserThunk', () => {
      const updatedUser = { ...mockUser, name: 'New User Name' };
      const action = {
        type: updateUserThunk.fulfilled.type,
        payload: {
          user: updatedUser
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('проверка rejected у forgotPasswordThunk', () => {
    test('проверка pending у forgotPasswordThunk', () => {
      const action = {
        type: forgotPasswordThunk.pending.type
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.passwordReset.emailSent).toBe(false);
    });

    test('проверка rejected у forgotPasswordThunk', () => {
      const errorMessage = 'ошибка в забыли пароль';
      const action = {
        type: forgotPasswordThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у forgotPasswordThunk', () => {
      const action = {
        type: forgotPasswordThunk.fulfilled.type,
        payload: undefined
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.passwordReset.emailSent).toBe(true);
    });
  });

  describe('проверка rejected у resetPasswordThunk', () => {
    test('проверка pending у resetPasswordThunk', () => {
      const action = {
        type: resetPasswordThunk.pending.type
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.passwordReset.resetSuccessful).toBe(false);
    });

    test('проверка rejected у resetPasswordThunk', () => {
      const errorMessage = 'ошибка в сбросе пароля';
      const action = {
        type: resetPasswordThunk.rejected.type,
        error: {
          message: errorMessage
        }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('проверка fulfilled у resetPasswordThunk', () => {
      const action = {
        type: resetPasswordThunk.fulfilled.type,
        payload: undefined
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.passwordReset.resetSuccessful).toBe(true);
    });
  });
});
