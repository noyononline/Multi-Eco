import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_seller_dashboard_index_data = createAsyncThunk(
  "dashboard/get_seller_dashboard_index_data",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/seller/get-dashboard-index-data`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_admin_dashboard_index_data = createAsyncThunk(
  "dashboard/get_admin_dashboard_index_data",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/admin/get-dashboard-index-data`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: {
    totalSale: 0,
    totalOrder: 0,
    totalProduct: 0,
    totalPendingOrder: 0,
    totalSeller: 0,
    recentOrders: [],
    recentMessage: [],
    chartData: {
      orders: [],
      revenue: [],
      sales: [],
      months: [],
    },
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      get_seller_dashboard_index_data.fulfilled,
      (state, action) => {
        state.totalSale = action.payload.totalSale;
        state.totalOrder = action.payload.totalOrder;
        state.totalProduct = action.payload.totalProduct;
        state.totalPendingOrder = action.payload.totalPendingOrder;
        state.recentOrders = action.payload.recentOrders;
        state.recentMessage = action.payload.messages;

        // Update chart data
        state.chartData.orders = action.payload.orders;
        state.chartData.revenue = action.payload.revenue;
        state.chartData.sales = action.payload.sales;
        state.chartData.months = action.payload.months;
      }
    );

    builder.addCase(
      get_admin_dashboard_index_data.fulfilled,
      (state, action) => {
        state.totalSale = action.payload.totalSale;
        state.totalOrder = action.payload.totalOrder;
        state.totalSeller = action.payload.totalSeller;
        state.totalProduct = action.payload.totalProduct;
        state.recentOrders = action.payload.recentOrders;
        state.recentMessage = action.payload.messages;

        // Update chart data
        state.chartData.orders = action.payload.orders;
        state.chartData.revenue = action.payload.revenue;
        state.chartData.sales = action.payload.sales;
        state.chartData.months = action.payload.months;
      }
    );
  },
});
export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;
