import { configureStore, createSlice } from "@reduxjs/toolkit";

let user = createSlice({
  name: "user",
  initialState: {
    sessionId: "Normal",
    duringTime: 0,
    enterTime: 0,
    userName: "",
    isPublisher: "",
    messageList: [],
    createdAt: 0,
  },
  reducers: {
    changeSession(state, roomId) {
      state.sessionId = roomId.payload;
    },
    changeDuringTime(state, duringTime) {
      state.duringTime = duringTime.payload;
    },
    changeEnterTime(state, time) {
      state.enterTime = time.payload;
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
    changeCreatedAt(state, time) {
      state.createdAt = time.payload;
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
  changeDuringTime,
  changeEnterTime,
  changeUserName,
  changeIsPublisher,
  changeMessageList,
  changeCreatedAt,
} = user.actions;
