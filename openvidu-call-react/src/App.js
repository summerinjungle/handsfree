import React from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/videoroom/VideoRoomHandsFree";
import Main from "./main/main";
import EditingRoom from "./components/edit/EditingRoom.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUserNameInCookie } from "./main/cookie";
import { useSelector } from "react-redux";

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
          element={
            <VideoRoomHandsFree
              sessionName={roomId}
              user={user}
              navigate={navigate}
              isPublisher={isPublisher}
              duringTime={duringTime}
              enterTime={enterTime}
            />
          }
        />
        <Route path='/edit' element={<EditingRoom roomId={roomId} />} />
        <Route path='/wave' element={<EditingRoom roomId={roomId} />} />
      </Routes>
    </div>
  );
};

export default App;
