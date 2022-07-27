import React from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Main from "./main/main";
import EditingRoom from "./components/edit/EditingRoom.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUserNameInCookie, getTokenInCookie } from "./main/cookie";
import { useDispatch } from "react-redux";
import { changeSession, changeIsPublisher, changeUserName } from "./store.js";

const App = () => {
  console.log("react App");
  const navigate = useNavigate();
  let username = getUserNameInCookie();
  let dispatch = useDispatch();
  let data = JSON.parse(localStorage.getItem("redux"));
  let sessionId;
  console.log("data == ", data);
  if (data === null) {
    sessionId = "sessionB";
  } else {
    sessionId = data.sessionId;
    dispatch(changeSession(sessionId));
    dispatch(changeIsPublisher(data.isPublisher));
    // dispatch(changeUserName(username));
  }
  let meetingPath = "/meeting/" + sessionId;
  let editPath = meetingPath + "/edit";
  let isLogin = getTokenInCookie();
  console.log("Asdasdasdas", isLogin);
  return (
    <div className='App'>
      <Routes>
        {isLogin === undefined ? (
          <Route path='/*' element={<Main username={username} />} />
        ) : (
          <>
            <Route
              path='/meeting'
              element={
                <VideoRoomHandsFree user={username} navigate={navigate} />
              }
            >
              <Route
                path={sessionId}
                element={
                  <VideoRoomHandsFree user={username} navigate={navigate} />
                }
              />
            </Route>

            <Route
              path={editPath}
              element={<EditingRoom sessionId={sessionId} />}
            ></Route>
            <Route path={"/*"} element={<> 없는페이지 입니다. </>} />
          </>
        )}
        <Route path='/' element={<Main username={username} />} />
      </Routes>
    </div>
  );
};
export default App;
