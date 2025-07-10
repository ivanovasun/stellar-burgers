import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrdersState {
  orders: TOrder[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  orderModalData: null,
  orderRequest: false,
  error: null
};

export const getOrdersThunk = createAsyncThunk('orders/getAll', getOrdersApi);

export const createOrderThunk = createAsyncThunk(
  'orders/create',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response;
  }
);

export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message ||
          'заказы пользватели не загружены из-за ошибки';
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message ||
          'ошибка, когда пользователь пытается создать заказ';
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message || 'заказ по номеру не получен из-за ошибки';
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
        state.orderRequest = false;
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
