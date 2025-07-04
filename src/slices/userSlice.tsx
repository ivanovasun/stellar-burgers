import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../utils/burger-api';
import { TUser } from '@utils-types';

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  password: string;
  token: string;
};

type AuthTokenState = {
  refreshToken: string | null;
  accessToken: string | null;
};

export interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
  auth: AuthTokenState;
  passwordReset: {
    emailSent: boolean;
    resetSuccessful: boolean;
  };
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: null,
  auth: {
    refreshToken: null,
    accessToken: null
  },
  passwordReset: {
    emailSent: false,
    resetSuccessful: false
  }
};

export const loginUserThunk = createAsyncThunk(
  'users/login',
  async ({ email, password }: TLoginData) => {
    const response = await loginUserApi({ email, password });
    return response;
  }
);

export const registerUserThunk = createAsyncThunk(
  'users/register',
  async ({ email, name, password }: TRegisterData) => {
    const response = await registerUserApi({ email, name, password });
    return response;
  }
);

export const logoutUserThunk = createAsyncThunk('users/logout', async () => {
  await logoutApi();
});

export const getUserThunk = createAsyncThunk('users/getUser', async () => {
  const response = await getUserApi();
  return response;
});

export const updateUserThunk = createAsyncThunk(
  'users/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response;
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'users/forgotPassword',
  async (data: ForgotPasswordData) => await forgotPasswordApi(data)
);

export const resetPasswordThunk = createAsyncThunk(
  'users/resetPassword',
  async (data: ResetPasswordData) => await resetPasswordApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    },
    clearAuthTokens: (state) => {
      state.auth = {
        refreshToken: null,
        accessToken: null
      };
    },
    resetPasswordState: (state) => {
      state.passwordReset = {
        emailSent: false,
        resetSuccessful: false
      };
    }
  },
  extraReducers: (builder) => {
    builder
      //логин
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ошибка при логине';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.auth = {
          refreshToken: action.payload.refreshToken,
          accessToken: action.payload.accessToken
        };
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      //получение данных пользователя
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        state.error = action.error.message || 'пользователь не получен';
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        state.user = action.payload.user;
      })
      //регистрация
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ошибка при регистрации';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.auth = {
          refreshToken: action.payload.refreshToken,
          accessToken: action.payload.accessToken
        };
      })
      //выход
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ошибка при логаут';
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.auth = {
          refreshToken: null,
          accessToken: null
        };
      })
      //обновление данных
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'данные не обновлены';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      //забыл пароль
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordReset.emailSent = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'забыли пароль: на почту не отправлено';
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordReset.emailSent = true;
      })
      //сброс пароля
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordReset.resetSuccessful = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'сброс пароля не успешен';
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordReset.resetSuccessful = true;
      });
  }
});

export const { init, clearAuthTokens, resetPasswordState } = userSlice.actions;

export default userSlice.reducer;
