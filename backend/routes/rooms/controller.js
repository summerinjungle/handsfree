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

//방 생성 API
exports.createRoom = async (req, res, next) => {
  try {

    var roomId = Math.random().toString(36).slice(-8);
    publisher = "A";  //임의
    const isVaild = await roomServices.validateRoomId(roomId);   // 같은 이름의 방이 있는지 검증하는 로직
    console.log("isVaild!!!", isVaild);
   
    if (isVaild == true){

      await roomServices.createRoom({roomId, publisher, timeString});
      
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



//방 입장 API
exports.joinRoom = async (req, res, next) => {
  try {

    const { roomId } = req.params;
    const isVaild = await roomServices.validateRoomId(roomId);   // 같은 이름의 방이 있는지 검증하는 로직
    console.log("isVaild!!!", isVaild);
   
    if (isVaild != true){     // 같은 방이 있으면
      
      //방 시작시간을 알려주는 로직이 들어가야 함
      console.log("hello!");
      const createTime = await roomServices.findRoomResponseTime(roomId);
      // console.log(createTime);

      res.status(CREATED).json({
        message: '방입장 성공',
        roomId: roomId,
        createdAt : createTime,
        isValidRoom : true
      });

    }
    else{
      console.log("방이름이 중복되지않습니다.");
      res.status(CREATED).json({
        message: '방입장 실패',
        isValidRoom : false
      });
    }

  } catch (error) {
    res.status(BAD_REQUEST).json({
      message: '방입장 실패',
      isValidRoom : false
    });

  }
}

exports.getEditingRoom = async (req, res, next) => {
  const roomId = req.params.roomId;
  const editingRoom = await roomServices.toEditingRoom(roomId);
  console.log(editingRoom);
  if(!editingRoom) {
    console.log("nono room");
    res.status(BAD_REQUEST).json({
      message: '잘못된 접근입니다'
    });
    return;
  }
  res.status(OK).json({
    editingRoom
  });
};


exports.createChat = async (req, res, next) => {
  const roomId = req.params.roomId;

  const room = await roomServices.createChat(roomId, req.body.chatList, req.body.highlightList, req.body.recordingStopList);
  if(!room) {
    res.status(BAD_REQUEST).json({
      message: '잘못된 접근입니다'
    });
    return;
  }
  res.status(CREATED).json({
    message: '방 정보가 저장되었습니다'
  });
};



