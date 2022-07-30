import React, { useState } from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Main from "./main/main";
import EditingRoom from "./components/edit/EditingRoom.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUserNameInCookie, getTokenInCookie } from "./main/cookie";
import { useSelector, useDispatch } from "react-redux";
import { changeSession, changeIsPublisher, changeUserName } from "./store.js";
import Anon from "./main/anon";

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
    dispatch(changeUserName(user));
  }
  let meetingPath = "/meeting/" + sessionId;
  let editPath = meetingPath + "/edit";
  let isLogin = getTokenInCookie();
  return (
    <div className='App'>
      <Routes>
        {
          isLogin === undefined ? (
            <Route path='/*' element={<Main />} />
          ):(
            <>
            <Route
              path='/meeting'
              element={<VideoRoomHandsFree user={user} navigate={navigate} />}
            >
              <Route
                path={sessionId}
                element={<VideoRoomHandsFree user={user} navigate={navigate} />}
              />
            </Route>
            <Route
              path={editPath}
              element={<EditingRoom sessionId={sessionId} />}
            ></Route>
            <Route path="/*" element={<Anon />} />
            </>
          )
        }
        <Route path='/' element={<Main />} />
      </Routes>
    </div>
  );
};
export default App;
