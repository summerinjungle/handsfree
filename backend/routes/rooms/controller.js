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



var timeString = hours + ':' + minutes  + ':' + seconds;


exports.createRoom = async (req, res, next) => {
  try {
    // publisher = req.user.id;
    var roomId = Math.random().toString(36).slice(-8);
    publisher = "A";  //임의
    const isVaild = await roomServices.validateRoomId(roomId);   // 같은 이름의 방이 있는지 검증하는 로직
    console.log("isVaild!!!", isVaild);
   
    if (isVaild == true){
      await roomServices.createRoom({roomId, publisher, timeString});
      // res.status(CREATED);
      res.status(CREATED).json({
        message: '방생성 성공',
        roomId: roomId
      });

    }
    else{
      console.log("방이름이 중복됩니다.");
      res.status(BAD_REQUEST).json({
        message: '방생성 실패',
      });
    }

  } catch (error) {
    res.status(BAD_REQUEST).json({
      message: '방생성 실패',
    });
  }
};





