import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_category = createAsyncThunk(
  "/product/get_category",
  async (arg, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/client/get-categorys");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const get_products = createAsyncThunk(
  "/product/get_products",
  async (arg, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/client/get-products");

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const get_product_details = createAsyncThunk(
  "/product/get_product_details",
  async (slug, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/client/get-product-details/${slug}`);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const price_range_product = createAsyncThunk(
  "/product/price_range_product",
  async (arg, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/client/price-range-latest-product");

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const query_products = createAsyncThunk(
  "/product/query_products",
  async (query, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/client/query-products/?category=${query.category}&&rating=${
          query.rating
        }&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${
          query.sortPrice
        }&&pageNumber=${query.pageNumber}&&searchValue=${
          query.searchValue ? query.searchValue : ""
        }`
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const customer_review = createAsyncThunk(
  "/review/customer_review",
  async (info, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(`/client/customer-review`, info);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const get_reviews = createAsyncThunk(
  "/review/get_reviews",
  async ({ productId, pageNumber }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/client/get-reviews/${productId}?pageNo=${pageNumber}`
      );
      console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const get_banners = createAsyncThunk(
  "product/get_banners",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/banners");
      return fulfillWithValue(data);
    } catch (error) {
      rejectWithValue(error.response);
    }
  }
);

const homeReducer = createSlice({
  name: "home",
  initialState: {
    categorys: [],
    products: [],
    product: {},
    relatedProducts: [],
    moreProducts: [],
    totalProduct: 0,
    perPage: 1,
    latest_products: [],
    topRated_products: [],
    discount_products: [],
    banners: [],

    reviews: [],
    totalReview: 0,
    rating_review: [],
    priceRange: {
      low: 1,
      high: 100,
    },
    error: null,
  },
  reducers: {
    messageClear: (state, _) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_category.rejected, (state, action) => {
      state.categorys = "";
    });
    builder.addCase(get_category.fulfilled, (state, action) => {
      state.categorys = action.payload.categorys;
    });

    builder.addCase(get_products.rejected, (state, action) => {
      state.error = "";
    });
    builder.addCase(get_products.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.latest_products = action.payload.latest_products;
      state.topRated_products = action.payload.topRated_products;
      state.discount_products = action.payload.discount_products;
    });
    builder.addCase(price_range_product.fulfilled, (state, action) => {
      state.latest_products = action.payload.latest_products;
      state.priceRange = action.payload.priceRange;
    });
    builder.addCase(query_products.rejected, (state, action) => {
      state.error = "";
    });
    builder.addCase(query_products.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.totalProduct = action.payload.totalProduct;
      state.perPage = action.payload.perPage;
    });
    builder.addCase(get_product_details.fulfilled, (state, action) => {
      state.product = action.payload.product;
      state.relatedProducts = action.payload.relatedProducts;
      state.moreProducts = action.payload.moreProducts;
    });
    builder.addCase(customer_review.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(get_reviews.fulfilled, (state, action) => {
      state.reviews = action.payload.reviews;
      state.totalReview = action.payload.totalReview;
      state.rating_review = action.payload.rating_review;
    });
    builder.addCase(get_banners.rejected, (state, action) => {
      state.banners = "";
    });
    builder.addCase(get_banners.fulfilled, (state, action) => {
      state.banners = action.payload.banners;
    });
  },
});
export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
