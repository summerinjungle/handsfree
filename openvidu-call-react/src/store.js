import { configureStore, createSlice } from "@reduxjs/toolkit";

let user = createSlice({
  name: "user",
  initialState: {
    sessionId: "Normal",
    userName: "",
    isPublisher: "",
    messageList: [],
  },
  reducers: {
    changeSession(state, roomId) {
      state.sessionId = roomId.payload;
    },
    changeUserName(state, name) {
      state.userName = name.payload;
    },
    changeIsPublisher(state, bool) {
      state.isPublisher = bool.payload;
    },
    changeMessageList(state, msgList) {
      state.messageList = msgList.payload;
    },
  },
});

export default configureStore({
  reducer: {
    user: user.reducer,
  },
});

export let {
  changeSession,
  changeUserName,
  changeIsPublisher,
  changeMessageList,
} = user.actions;
