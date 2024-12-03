import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const categoryAdd = createAsyncThunk(
  "category/categoryAdd",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/category-add", payload, {
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

export const get_category = createAsyncThunk(
  "category/get_category",
  async (
    { perPage, page, searchValue },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/category-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const categoryReducer = createSlice({
  name: "category",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    categorys: [],
    totalCategory: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(categoryAdd.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(categoryAdd.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload?.error;
    });
    builder.addCase(categoryAdd.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.categorys.push(action.payload.category);
    });

    builder.addCase(get_category.fulfilled, (state, action) => {
      state.totalCategory = action.payload.totalCategory;
      state.categorys = action.payload.categorys;
    });
  },
});
export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;
