import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_admin_orders = createAsyncThunk(
  "order/get_admin_orders",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/admin-orders?page=${page}&searchValue=${searchValue}&perPage=${perPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_admin_order = createAsyncThunk(
  "order/get_admin_order",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/admin-order/${orderId}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const admin_order_status_update = createAsyncThunk(
  "order/admin_order_status_update",
  async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/admin/order-status-update/${orderId}`,
        info,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_seller_orders = createAsyncThunk(
  "order/get_seller_orders",
  async (
    { perPage, page, searchValue, sellerId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/seller-orders/${sellerId}?page=${page}&searchValue=${searchValue}&perPage=${perPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_seller_order = createAsyncThunk(
  "order/get_seller_order",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/seller-order/${orderId}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_order_status_update = createAsyncThunk(
  "order/seller_order_status_update",
  async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/seller/order-status-update/${orderId}`,
        info,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderReducer = createSlice({
  name: "order",
  initialState: {
    successMessage: "",
    errorMessage: "",
    totalOrder: 0,
    order: {},
    myOrders: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_admin_orders.fulfilled, (state, action) => {
      state.myOrders = action.payload.orders;
      state.totalOrder = action.payload.totalOrder;
    });
    builder.addCase(get_admin_order.fulfilled, (state, action) => {
      state.order = action.payload.order;
    });
    builder.addCase(admin_order_status_update.rejected, (state, action) => {
      state.errorMessage = action.payload.message;
    });
    builder.addCase(admin_order_status_update.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(get_seller_orders.fulfilled, (state, action) => {
      state.myOrders = action.payload.orders;
      state.totalOrder = action.payload.totalOrder;
    });
    builder.addCase(get_seller_order.fulfilled, (state, action) => {
      state.order = action.payload.order;
    });
    builder.addCase(seller_order_status_update.rejected, (state, action) => {
      state.errorMessage = action.payload.message;
    });
    builder.addCase(seller_order_status_update.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
  },
});
export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
