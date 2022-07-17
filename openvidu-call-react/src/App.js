import React, { useState } from "react";
import "./App.css";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import Main from "./main/main";
import { useSelector } from "react-redux";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Edit from "./components/edit/Edit";

const App = () => {
  let roomId = useSelector((state) => state.user.sessionId);

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route
          path='/meeting'
          element={<VideoRoomHandsFree sessionName={roomId} />}
        />
        <Route path='/edit' element={<Edit />} />
      </Routes>
    </div>
  );
};

export default App;
