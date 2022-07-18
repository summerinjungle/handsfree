import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
  name : 'user', 
  initialState : {sessionId : 'SessionB', duringTime: 0, enterTime: 0, userName: '', isPublisher: ''},
  reducers : {
    changeSession(state, roomId) {
      state.sessionId = roomId.payload
    },
    changeDuringTime(state, duringTime) {
      state.duringTime = duringTime.payload
    },
    changeEnterTime(state, time) {
      state.enterTime = time.payload
    },
    changeUserName(state, name) {
      state.userName = name.payload
    },
    changeIsPublisher(state, bool) {
      state.isPublisher = bool.payload
    }
  }
})

export default configureStore({
  reducer: {
    user : user.reducer
  }
}) 

export let {
  changeSession,
  changeDuringTime,
  changeEnterTime,
  changeUserName,
  changeIsPublisher
} = user.actions 