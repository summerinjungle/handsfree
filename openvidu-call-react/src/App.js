import React, { useState } from "react";
import VideoRoomComponent from "./components/VideoRoomComponent";
import SocketIo from "./SocketIo";
import "./App.css";
import Dictaphone from "./components/Dictaphone";
import VideoRoomSub from "./components/VideoRoomSub";

const App = () => {
  const [showRoom, setShowRoom] = useState(false);

  const joinRoom = () => {
    // socket.emit("join_room", room);
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
          <VideoRoomSub />
        </div>
      )}
    </div>
  );
};

export default App;
