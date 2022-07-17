import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
  name : 'user', 
  initialState : {sessionId : 'SessionB', time: 0},
  reducers : {
    changeName(state, code) {
      state.sessionId = code.payload
    }
  }
})

export default configureStore({
  reducer: {
    user : user.reducer
  }
}) 

export let { changeName } = user.actions 