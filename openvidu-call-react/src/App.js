import React, { useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Main from "./main/main";
import { useSelector } from "react-redux";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Edit from "./components/edit/Edit";
import { getUserNameInCookie } from './main/cookie';


const App = () => {
  let roomId = useSelector((state) => state.user.sessionId);
  const navigate = useNavigate();
  let user = getUserNameInCookie();
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route
          path='/meeting'
          element={<VideoRoomHandsFree sessionName={roomId} user={user}  navigate={navigate} />}
        />
        <Route path='/edit' element={<Edit />} />
      </Routes>
    </div>
  );
};

export default App;
