import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_dashboard_index_data = createAsyncThunk(
  "dashboard/get_dashboard_index_data",
  async (userId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/customer/get-dashboard-data/${userId}`);

      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response);
    }
  }
);

export const get_dashboard_orders = createAsyncThunk(
  "dashboard/get_dashboard_orders",
  async ({ customerId, status }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/customer/get-dashboard-order/${customerId}/${status}`
      );

      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response);
    }
  }
);

export const get_order_details = createAsyncThunk(
  "dashboard/get_order_details",
  async (orderId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/customer/get-order-details/${orderId}`);

      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response);
    }
  }
);

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: {
    recentOrders: [],
    errorMessage: "",
    successMessage: "",
    myOrders: [],
    viewOrder: {},
    totalOrders: 0,
    pendingOrder: 0,
    cancelledOrder: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_dashboard_index_data.fulfilled, (state, action) => {
      state.totalOrders = action.payload.totalOrders;
      state.pendingOrder = action.payload.pendingOrder;
      state.cancelledOrder = action.payload.cancelledOrder;
      state.recentOrders = action.payload.recentOrders;
    });
    builder.addCase(get_dashboard_orders.fulfilled, (state, action) => {
      state.myOrders = action.payload.orders;
    });
    builder.addCase(get_order_details.fulfilled, (state, action) => {
      state.viewOrder = action.payload.order_details;
    });
  },
});

export const { messageClear } = dashboardReducer.actions;

export default dashboardReducer.reducer;
