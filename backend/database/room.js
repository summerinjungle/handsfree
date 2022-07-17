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
        await room.save()
        .then(() => {
          console.log("저장성공");
        }).catch((err) => {
          console.log("저장실패")
          throw err;
        })
};

// 방 이름 중복 검사
exports.findByRoomId = async (roomId) => {
  return await Room.find({ 'roomId': roomId }).lean();
}

exports.findoneByRoomId = async (roomId) => {
  return await Room.findOne({ 'roomId': roomId }).lean();
}

