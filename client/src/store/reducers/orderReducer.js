import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const place_order = createAsyncThunk(
  "order/place_order",
  async (
    { price, products, shipping_fee, shippingInfo, userId, navigate, items },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post("/client/place-order", {
        price,
        products,
        shipping_fee,
        shippingInfo,
        userId,
        navigate,
        items,
      });
      console.log(data);
      navigate("/payment", {
        state: { price: price + shipping_fee, items, orderId: data.orderId },
      });

      return true;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderReducer = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    errorMessage: "",
    successMessage: "",
    myOrder: {},
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(place_order.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
  },
});

export const { messageClear } = orderReducer.actions;

export default orderReducer.reducer;
