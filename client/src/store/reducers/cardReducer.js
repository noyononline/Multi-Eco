import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_to_card = createAsyncThunk(
  "card/add_to_card",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/client/add-to-card", info);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const add_to_wishlist = createAsyncThunk(
  "card/add_to_wishlist",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/client/add-to-wishlist", info);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_wishlist_products = createAsyncThunk(
  "card/get_wishlist_products",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/client/get-wishlist-products/${userId}`);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const remove_wishlist = createAsyncThunk(
  "card/remove_wishlist",
  async (wishlistId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/client/delete-wishlist-product/${wishlistId}`
      );
      console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_card_products = createAsyncThunk(
  "card/get_card_products",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/client/get-card-products/${userId}`);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const delete_card_product = createAsyncThunk(
  "card/delete_card_product",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/client/delete-card-product/${card_id}`
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const quantity_increment = createAsyncThunk(
  "card/quantity_increment",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/client/quantity-increment/${card_id}`);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const quantity_decrement = createAsyncThunk(
  "card/quantity_decrement",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/client/quantity-decrement/${card_id}`);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const cardReducer = createSlice({
  name: "card",
  initialState: {
    card_products: [],
    card_product_count: 0,
    buy_product_item: 0,
    wishlist_count: 0,
    wishlists: [],
    price: 0,
    errorMessage: "",
    successMessage: "",
    shipping_fee: 0,
    outofstock_products: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(add_to_card.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(add_to_card.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
      state.card_product_count = state.card_product_count + 1;
    });
    builder.addCase(get_card_products.fulfilled, (state, action) => {
      state.card_products = action.payload.card_products;
      state.card_product_count = action.payload.card_product_count;
      state.price = action.payload.price;
      state.shipping_fee = action.payload.shipping_fee;
      state.outofstock_products = action.payload.outofStockProduct;
      state.buy_product_item = action.payload.buy_product_item;
    });
    builder.addCase(delete_card_product.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(delete_card_product.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(quantity_increment.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(quantity_decrement.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(add_to_wishlist.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(add_to_wishlist.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
      state.wishlist_count =
        state.wishlist_count > 0 ? state.wishlist_count + 1 : 1;
    });
    builder.addCase(get_wishlist_products.fulfilled, (state, action) => {
      state.wishlists = action.payload.wishlists;
      state.wishlist_count = action.payload.wishlist_count;
    });
    builder.addCase(remove_wishlist.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
      state.wishlists = state.wishlists.filter(
        (p) => p._id !== action.payload.wishlistId
      );
      state.wishlist_count = state.wishlist_count - 1;
    });
  },
});

export const { messageClear } = cardReducer.actions;

export default cardReducer.reducer;
