import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/admin-login", payload, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_register = createAsyncThunk(
  "auth/seller_register",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      console.log(payload);

      const { data } = await api.post("/seller-register", payload, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_login = createAsyncThunk(
  "auth/seller_login",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/seller-login", payload, {
        withCredentials: true,
      });

      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/logout", { withCredentials: true });
      localStorage.removeItem("accessToken");
      if (role === "admin") {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_image_upload = createAsyncThunk(
  "auth/profile_image_upload",
  async (image, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-image-upload", image, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const profile_info_add = createAsyncThunk(
  "auth/profile_info_add",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-info-add", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/get-user", {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const returnRole = (token) => {
  if (token) {
    const decodeToken = jwtDecode(token);
    const expireTime = new Date(decodeToken.exp * 1000);
    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return "";
    } else {
      return decodeToken.role;
    }
  } else {
    return "";
  }
};

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: "",
    role: returnRole(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken"),
  },
  reducers: {
    messageClear: (state, _) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(admin_login.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(admin_login.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(admin_login.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.token = action.payload.token;
      state.role = returnRole(action.payload.role);
    });

    builder.addCase(seller_register.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(seller_register.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(seller_register.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
    });

    builder.addCase(seller_login.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(seller_login.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(seller_login.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
    });

    builder.addCase(get_user_info.fulfilled, (state, action) => {
      state.loader = false;
      state.userInfo = action.payload.userInfo;
    });
    builder.addCase(profile_image_upload.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(profile_image_upload.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(profile_image_upload.fulfilled, (state, action) => {
      state.loader = false;
      state.userInfo = action.payload.userInfo;
      state.successMessage = action.payload.message;
    });
    builder.addCase(profile_info_add.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(profile_info_add.fulfilled, (state, action) => {
      state.loader = false;
      state.userInfo = action.payload.userInfo;
      state.successMessage = action.payload.message;
    });
  },
});
export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
