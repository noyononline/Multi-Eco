import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_customer_friend = createAsyncThunk(
  "card/add_customer_friend",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/client/add-customer-friend", info);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const send_message_to_seller = createAsyncThunk(
  "card/send_message_to_seller",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/client/send-message-to-seller", info);
      console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const chatReducer = createSlice({
  name: "chat",
  initialState: {
    my_friends: [],
    fd_message: [],
    currentFd: "",
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    updateMessage: (state, action) => {
      state.fd_message = [...state.fd_message, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(add_customer_friend.fulfilled, (state, action) => {
      state.fd_message = action.payload.message;
      state.currentFd = action.payload.currentFd;
      state.my_friends = action.payload.myFriends;
    });

    builder.addCase(send_message_to_seller.fulfilled, (state, action) => {
      let tempFriends = state.my_friends;
      let index = tempFriends.findIndex(
        (f) => f.fdId === action.payload.message
      );
      while (index > 0) {
        let temp = tempFriends[index];
        tempFriends[index] = tempFriends[index - 1];
        tempFriends[index - 1] = temp;
        index--;
      }
      state.my_friends = tempFriends;
      state.fd_message = [
        ...state.fd_message,
        action.payload.message.receverId,
      ];
      state.successMessage = "message send success";
    });
  },
});

export const { messageClear, updateMessage } = chatReducer.actions;

export default chatReducer.reducer;
