const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;
const roomrServices = require('../../services/room');

/*
    POST /api/rooms/
    * 방생성 오픈 API
*/

var today = new Date();
var roomId = Math.random().toString(36).slice(-8);

var hours = ('0' + today.getHours()).slice(-2); 
var minutes = ('0' + today.getMinutes()).slice(-2);
var seconds = ('0' + today.getSeconds()).slice(-2); 

var timeString = hours + ':' + minutes  + ':' + seconds;

exports.setRoom = async (req, res, next) => {
  try {
   
    await roomServices.setRoom({roomId, timeString});

    res.status(CREATED).json({
      message: '사용자 가입 성공',
      roomId,
      timeString,

    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      message: '사용자 가입 실패',
      
    });
  }
};

