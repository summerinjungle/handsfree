const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;
require("dotenv").config()
const roomServices = require('../../services/room');

/*
    POST /api/rooms/
    * 방생성 오픈 API
*/

// 시간, 랜덤 방이름 생성
var today = new Date();
var hours = ('0' + today.getHours()).slice(-2); 
var minutes = ('0' + today.getMinutes()).slice(-2);
var seconds = ('0' + today.getSeconds()).slice(-2); 


//중복이 있는지 DB에서
var roomId = Math.random().toString(36).slice(-8);
var timeString = hours + ':' + minutes  + ':' + seconds;


exports.createRoom = async (req, res, next) => {
  try {
    
    // publisher = req.user.id;
    publisher = "A";
    console.log(roomId);
    await roomServices.createRoom({roomId, publisher, timeString});

    res.status(CREATED).json({
      message: '방생성 성공',
      // roomId,
      // timeString,

    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      message: '방생성 실패',
      
    });
  }
};





