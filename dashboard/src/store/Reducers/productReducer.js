import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_product = createAsyncThunk(
  "product/add_product",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/product-add", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_products = createAsyncThunk(
  "product/get_products",
  async (
    { perPage, page, searchValue },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/products-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const get_product = createAsyncThunk(
  "product/get_product",
  async (productId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/product-get/${productId}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const update_product = createAsyncThunk(
  "product/update_product",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/product-update", payload, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const product_image_update = createAsyncThunk(
  "product/product_image_update",
  async (
    { oldImage, newImage, productId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("oldImage", oldImage);
      formData.append("newImage", newImage);
      formData.append("productId", productId);
      const { data } = await api.post("/product-image-update", formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const productReducer = createSlice({
  name: "product",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    products: [],
    product: "",
    totalProduct: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(add_product.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(add_product.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload?.error;
    });
    builder.addCase(add_product.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
    });
    builder.addCase(get_products.fulfilled, (state, action) => {
      state.totalProduct = action.payload.totalProduct;
      state.products = action.payload.products;
    });
    builder.addCase(get_product.fulfilled, (state, action) => {
      state.product = action.payload.product;
    });
    builder.addCase(update_product.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(update_product.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload?.error;
    });
    builder.addCase(update_product.fulfilled, (state, action) => {
      state.loader = false;
      state.product = action.payload.product;
      state.successMessage = action.payload.message;
    });
    builder.addCase(product_image_update.fulfilled, (state, action) => {
      state.product = action.payload.product;
      state.successMessage = action.payload.message;
    });
  },
});
export const { messageClear } = productReducer.actions;
export default productReducer.reducer;
