import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
  name : 'user', 
  initialState : {sessionId : 'SessionB', time: 0, userName: '', isRecording: true},
  reducers : {
    changeSession(state, code) {
      state.sessionId = code.payload
    },
    changeUserName(state, name) {
      state.userName = name.payload
    }
  }
})

export default configureStore({
  reducer: {
    user : user.reducer
  }
}) 

export let { changeSession, changeUserName } = user.actions 