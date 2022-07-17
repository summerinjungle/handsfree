import React, { useState } from "react";
import "./App.css";
import VideoRoomHandsFree from "./components/VideoRoomHandsFree";
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import Main from './main/main';
import { useSelector } from "react-redux"


const App = () => {
  let roomId = useSelector((state) => state.user.sessionId);
  
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={ <Main /> }/>
        <Route path="/meeting" element={ <VideoRoomHandsFree sessionName={roomId}/> }/>
        <Route path="/edit" element={ <div>{ roomId }</div>} />
      </Routes>
    </div>
  );
};


export default App;
