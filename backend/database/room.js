const express = require('express');
const Room = require('../models/Room');

exports.createRoom = async ({roomId, publisher, timeString}) => {
        const roomInfo = {
          roomId : roomId,
          publisher : publisher,
          isRecording : true,
          recordingUrl : "",
          createdAt : timeString,
          chatingList : [],
          emailList : [],
        };
        const room = new Room(roomInfo);
        console.log(room);
        const newRoom = await room.save();
        return newRoom;
};

// 방 이름 중복 검사
exports.findByRoomId = async (roomId) => {
  const findRoom = await Room.findOne({ 'roomId': roomId }).exec();
  console.log("DB3", findRoom.roomId);

  if (findRoom.roomId == roomId ){
    //console.log("존재하는 방");
    return false; //존재하는방이면
  }
  else{
    //console.log("존재하지 않는 방");
    return true;
  }
  
  
  // return findRoom.roomId;
  // return await Room.findOne({ 'roomId': roomId }).exec();
};

