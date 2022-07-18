import React from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Edit from "./components/edit/Edit";
import Main from "./main/main";
import Wave from "./components/edit/Wave";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUserNameInCookie } from "./main/cookie";
import { useSelector } from "react-redux";
import Surfer from "./components/edit/Surfer";

const App = () => {

  let roomId = useSelector((state) => state.user.sessionId);
  let isPublisher = useSelector((state) => state.user.isPublisher);
  let duringTime = useSelector((state) => state.user.duringTime);
  let enterTime = useSelector((state) => state.user.enterTime);
  
  const navigate = useNavigate();
  let user = getUserNameInCookie();
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route
          path='/meeting'
          element={<VideoRoomHandsFree 
            sessionName={roomId}
            user={user}
            navigate={navigate} 
            isPublisher = {isPublisher}
            duringTime = {duringTime}
            enterTime = {enterTime}
          />}
        />
        <Route path='/edit' element={<Edit />} />
        <Route path='/wave' element={<Wave 
          roomId={roomId}
        />} />
        <Route path='/surfer' element={<Surfer />} />
      </Routes>
    </div>
  );
};

export default App;
