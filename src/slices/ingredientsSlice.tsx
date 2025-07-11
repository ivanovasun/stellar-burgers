import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
<<<<<<< HEAD
import { getIngredientsApi } from '@api';
=======
import { getIngredientsApi } from '../utils/burger-api';
>>>>>>> 8186dbb (tests done)
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  items: TIngredient[];
  currentIngredient: TIngredient | null;
  isIngredientsLoading: boolean;
  error: string | null;
}

<<<<<<< HEAD
const initialState: IIngredientsState = {
=======
export const initialState: IIngredientsState = {
>>>>>>> 8186dbb (tests done)
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
