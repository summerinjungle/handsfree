const express = require('express');
const Room = require('../models/Room');

exports.createRoom = async ({roomId, publisher, timeString}) => {
        try {
          const room = await Room.create({
            roomId: roomId,
            publisher: publisher,
            isEnd: false,
            recordingUrl: "",
            createdAt: timeString,
            emailList: [],
            chatList: [],
            starList: [],
            recordMuteList: []
          });
        } catch (err) {
          console.log(err);
        }
  
};

// 방 이름 중복 검사
exports.findByRoomId = async (roomId) => {
  return await Room.find({ 'roomId': roomId }).lean();

}

exports.findOneByRoomId = async (roomId) => {
  return await Room.findOne({ 'roomId': roomId }).lean();
}

  
exports.findRoomAndUpdate = async (filter, update) => {
  return await Room.findOneAndUpdate(filter, update).lean();
};


