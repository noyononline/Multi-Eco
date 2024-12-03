import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_seller_request = createAsyncThunk(
  "seller/get_seller_request",
  async (
    { perPage, page, searchValue },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/request-seller-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
        {
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_seller = createAsyncThunk(
  "seller/get_seller",
  async (sellerId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/get-seller/${sellerId}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_status_update = createAsyncThunk(
  "seller/seller_status_update",
  async (info, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(`/seller-status-update`, info, {
        withCredentials: true,
      });
      console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_active_sellers = createAsyncThunk(
  "seller/get_active_sellers",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/get-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_deactive_sellers = createAsyncThunk(
  "seller/get_deactive_sellers",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const create_stripe_connect_account = createAsyncThunk(
  "seller/create_stripe_connect_account",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const {
        data: { url },
      } = await api.get(`/payment/create-stripe-connect-account`, {
        withCredentials: true,
      });
      window.location.href = url;

      return fulfillWithValue(url);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const active_stripe_connect_account = createAsyncThunk(
  "seller/active_stripe_connect_account",
  async (activeCode, { rejectWithValue, fulfillWithValue }) => {
    console.log("Active Code being sent:", activeCode);
    try {
      const { data } = await api.put(
        `/payment/active-stripe-connect-account/${activeCode}`,
        {},
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sellerReducer = createSlice({
  name: "seller",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    sellers: [],
    totalSeller: 0,
    seller: "",
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_seller_request.fulfilled, (state, action) => {
      state.totalSeller = action.payload.totalSeller;
      state.sellers = action.payload.sellers;
    });
    builder.addCase(get_seller.fulfilled, (state, action) => {
      state.seller = action.payload.seller;
    });
    builder.addCase(seller_status_update.fulfilled, (state, action) => {
      state.seller = action.payload.seller;
      state.successMessage = action.payload.message;
    });
    builder.addCase(get_active_sellers.fulfilled, (state, action) => {
      state.sellers = action.payload.sellers;
      state.totalSeller = action.payload.totalSeller;
    });
    builder.addCase(get_deactive_sellers.fulfilled, (state, action) => {
      state.sellers = action.payload.sellers;
      state.totalSeller = action.payload.totalSeller;
    });
    builder.addCase(active_stripe_connect_account.pending, (state, action) => {
      state.loader = true;
    });
    builder.addCase(active_stripe_connect_account.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(
      active_stripe_connect_account.fulfilled,
      (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      }
    );
  },
});
export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer;
