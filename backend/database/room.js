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
        const newRoom = await room.save();
        console.log("ddddddd");
        return newRoom;
};

// 방 이름 중복 검사
exports.findByRoomId = async (roomId) => {
  return await Room.find({ 'roomId': roomId }).exec();
  
  // return findRoom.roomId;
  // return await Room.findOne({ 'roomId': roomId }).exec();
};

