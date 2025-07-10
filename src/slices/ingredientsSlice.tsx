import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  items: TIngredient[];
  currentIngredient: TIngredient | null;
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  items: [],
  currentIngredient: null,
  isIngredientsLoading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'ошибка загрузки ингридиентов';
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.items = action.payload;
      });
  }
});

export default ingredientsSlice.reducer;
