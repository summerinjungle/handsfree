import React, { useState } from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/VideoRoomHandsFree";

const App = () => {
  const [showRoom, setShowRoom] = useState(false);

  const joinRoom = () => {
    setShowRoom(true);
  };
  return (
    <div className='App'>
      {!showRoom ? (
        <div className='joinChatContainer'>
          <h3>핸즈 프리 </h3>

          <button onClick={joinRoom}>회의실 입장</button>
        </div>
      ) : (
        <div>
          <VideoRoomHandsFree />
        </div>
      )}
    </div>
  );
};

export default App;
