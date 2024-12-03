import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_customers = createAsyncThunk(
  "chat/get_customers",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/chat-seller/get-customers/${sellerId}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_customer_message = createAsyncThunk(
  "chat/get_customer_message",
  async (customerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/chat/seller/get-customer-message/${customerId}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const send_message = createAsyncThunk(
  "chat/send_message",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/chat-seller/send-message-to-customer`,
        info,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_sellers = createAsyncThunk(
  "chat/get_sellers",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/chat/admin/get-sellers`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const send_message_seller_admin = createAsyncThunk(
  "chat/send_message_seller_admin",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/chat/message-send-seller-admin`, info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_admin_message = createAsyncThunk(
  "chat/get_admin_message",
  async (receverId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/chat/get-admin-messages/${receverId}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_seller_message = createAsyncThunk(
  "chat/get_seller_message",
  async (receverId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/chat/get-seller-messages`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const chatReducer = createSlice({
  name: "chat",
  initialState: {
    successMessage: "",
    errorMessage: "",
    customers: [],
    messages: [],
    activeCustomer: [],
    activeSellers: [],
    messageNotification: [],
    activeAdmin: "",
    friends: [],
    seller_admin_message: [],
    currentSeller: {},
    currentCustomer: {},
    sellers: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
    updateMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    updateCustomer: (state, action) => {
      state.activeCustomer = action.payload;
    },
    updateSellers: (state, action) => {
      state.activeSellers = action.payload;
    },
    updateAdminMessage: (state, action) => {
      state.seller_admin_message = [
        ...state.seller_admin_message,
        action.payload,
      ];
    },
    updateSellerMessage: (state, action) => {
      state.seller_admin_message = [
        ...state.seller_admin_message,
        action.payload,
      ];
    },
    activeStatus_update: (state, action) => {
      state.activeAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_customers.fulfilled, (state, action) => {
      state.customers = action.payload.customers;
    });
    builder.addCase(get_customer_message.fulfilled, (state, action) => {
      state.messages = action.payload.message;
      state.currentCustomer = action.payload.currentCustomer;
    });
    builder.addCase(send_message.fulfilled, (state, action) => {
      let tempFriends = state.customers;
      let index = tempFriends.findIndex(
        (f) => f.fdId === action.payload.message.receverId
      );
      while (index > 0) {
        let temp = tempFriends[index];
        tempFriends[index] = tempFriends[index - 1];
        tempFriends[index - 1] = temp;
        index--;
      }
      state.customers = tempFriends;
      state.messages = [...state.messages, action.payload.message];
      state.successMessage = "message send success";
    });
    builder.addCase(get_sellers.fulfilled, (state, action) => {
      state.sellers = action.payload.sellers;
    });
    builder.addCase(send_message_seller_admin.fulfilled, (state, action) => {
      state.seller_admin_message = [
        ...state.seller_admin_message,
        action.payload.message,
      ];
      state.successMessage = "Message send success";
    });
    builder.addCase(get_admin_message.fulfilled, (state, action) => {
      state.seller_admin_message = action.payload.messages;
      state.currentSeller = action.payload.currentSeller;
    });
    builder.addCase(get_seller_message.fulfilled, (state, action) => {
      state.seller_admin_message = action.payload.messages;
    });
  },
});
export const {
  messageClear,
  updateMessage,
  updateCustomer,
  updateSellers,
  updateAdminMessage,
  updateSellerMessage,
  activeStatus_update,
} = chatReducer.actions;
export default chatReducer.reducer;
