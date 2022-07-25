import React, { useState } from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Main from "./main/main";
import EditingRoom from "./components/edit/EditingRoom.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUserNameInCookie } from "./main/cookie";
import { useSelector, useDispatch } from "react-redux";
import VoiceRoom from "./components/voiceroom/VoiceRoom";
import {
  changeSession,
  changeIsPublisher,
  changeUserName,
} from "./store.js";

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
    dispatch(changeUserName(getUserNameInCookie()));
  }
  let meetingPath = "/meeting/" + sessionId;
  let editPath = meetingPath + "/edit";

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
        <Route
          path={editPath}
          element={<EditingRoom sessionId={sessionId} />}
        ></Route>
        <Route path={"/*"} element={<div> 없는페이지 입니다. </div>} />
        <Route path={"/voice"} element={<VoiceRoom />} />
      </Routes>
    </div>
  );
};
export default App;
