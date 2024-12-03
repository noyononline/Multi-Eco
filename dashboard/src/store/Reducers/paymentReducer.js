import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_seller_payment_details = createAsyncThunk(
  "payment/get_seller_payment_details",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/payment/get-seller-payment-details/${sellerId}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const send_withdrowal_request = createAsyncThunk(
  "payment/send_withdrowal_request",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/payment/withdrowal-request`, info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_payment_request_admin = createAsyncThunk(
  "payment/get_payment_request_admin",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/payment-request-admin`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const confirm_payment_request = createAsyncThunk(
  "payment/confirm_payment_request",
  async (paymentId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/payment/request-confirm`,
        { paymentId },
        { withCredentials: true }
      );
      console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const paymentReducer = createSlice({
  name: "payment",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    pendingWithdrows: [],
    successWithdrows: [],
    totalAmount: 0,
    withdrowAmount: 0,
    pendingAmount: 0,
    availableAmount: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_seller_payment_details.fulfilled, (state, action) => {
      state.pendingWithdrows = action.payload.pendingWithdrows;
      state.successWithdrows = action.payload.successWithdrows;
      state.totalAmount = action.payload.totalAmount;
      state.availableAmount = action.payload.availableAmount;
      state.withdrowAmount = action.payload.withdrowAmount;
      state.pendingAmount = action.payload.pendingAmount;
    });
    builder.addCase(send_withdrowal_request.pending, (state, action) => {
      state.loader = true;
    });
    builder.addCase(send_withdrowal_request.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(send_withdrowal_request.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.pendingWithdrows = [
        ...state.pendingWithdrows,
        action.payload.withdrowal,
      ];
      state.availableAmount =
        state.availableAmount - action.payload.withdrowal.amount;
      state.pendingAmount = action.payload.withdrowal.amount;
    });
    builder.addCase(get_payment_request_admin.fulfilled, (state, action) => {
      state.pendingWithdrows = action.payload.withdrowalRequest;
    });
    builder.addCase(confirm_payment_request.pending, (state, action) => {
      state.loader = true;
    });
    builder.addCase(confirm_payment_request.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(confirm_payment_request.fulfilled, (state, action) => {
      const temp = state.pendingWithdrows.filter(
        (r) => r._id !== action.payload.payment._id
      );
      state.loader = false;
      state.successMessage = action.payload.message;
      state.pendingWithdrows = temp;
    });
  },
});
export const { messageClear } = paymentReducer.actions;
export default paymentReducer.reducer;
