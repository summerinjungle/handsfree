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

