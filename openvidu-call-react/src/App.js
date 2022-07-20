import React from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Main from "./main/main";
import EditingRoom from "./components/edit/EditingRoom.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUserNameInCookie } from "./main/cookie";
import { useSelector } from "react-redux";
const App = () => {
  const navigate = useNavigate();
  let user = getUserNameInCookie();

  let dispatch = useDispatch();
  let data = JSON.parse(localStorage.getItem("redux"));
  let sessionId;
  if (data === null) {
    sessionId = "sessionB";
  } else {
    sessionId = data.sessionId;
    dispatch(changeSession(sessionId));
    dispatch(changeIsPublisher(data.isPublisher));
    dispatch(changeDuringTime(data.duringTime));
    dispatch(changeEnterTime(data.enterTime));
    dispatch(changeUserName(getUserNameInCookie()));
  }

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route
          path='/meeting'
          element={<VideoRoomHandsFree user={user} navigate={navigate} />}
        >
          <Route
            path={sessionId}
            element={<VideoRoomHandsFree user={user} navigate={navigate} />}
          />
        </Route>
        <Route path='/edit' element={<EditingRoom />} />
      </Routes>
    </div>
  );
};
export default App;
