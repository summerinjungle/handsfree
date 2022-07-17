const express = require('express');
const Room = require('../models/Room');

exports.createRoom = async ({roomId, publisher, timeString}) => {
        try {
          const room = await Room.create({
            roomId: roomId,
            publisher: publisher,
            isRecording: true,
            recordingUrl: "",
            createdAt: timeString,
            emailList: [],
            chatList: "",
            highlightList: "",
            recordingStopList: ""
          });
        } catch (err) {
          console.log(err);
        }
  
};

// 방 이름 중복 검사
exports.findByRoomId = async (roomId) => {
  return await Room.find({ 'roomId': roomId }).lean();

}

exports.findoneByRoomId = async (roomId) => {
  return await Room.findOne({ 'roomId': roomId }).lean();
}

  
exports.findRoomAndUpdate = async (filter, update) => {
  return await Room.findOneAndUpdate(filter, update).lean();
  
  // return findRoom.roomId;
  // return await Room.findOne({ 'roomId': roomId }).exec();
};


