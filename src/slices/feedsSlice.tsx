import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
<<<<<<< HEAD
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';
=======
import { getFeedsApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
>>>>>>> 8186dbb (tests done)

interface FeedsState {
  orders: TOrder[];
  total: number;
  totalToday: number;
<<<<<<< HEAD
  currentOrder: TOrder | null;
=======
>>>>>>> 8186dbb (tests done)
  isLoading: boolean;
  error: string | null;
}

<<<<<<< HEAD
const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
=======
export const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
>>>>>>> 8186dbb (tests done)
  isLoading: false,
  error: null
};

export const getFeedsThunk = createAsyncThunk('feeds/getAll', getFeedsApi);

<<<<<<< HEAD
export const getOrderByNumberThunk = createAsyncThunk(
  'feeds/getByNumber',
  async (number: number): Promise<TOrder> => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
=======
export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
>>>>>>> 8186dbb (tests done)
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ошибка загрузки ленты';
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
<<<<<<< HEAD
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ошибка загрузки ленты заказа';
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
=======
>>>>>>> 8186dbb (tests done)
      });
  }
});

<<<<<<< HEAD
export const { clearCurrentOrder } = feedsSlice.actions;
=======
>>>>>>> 8186dbb (tests done)
export default feedsSlice.reducer;
