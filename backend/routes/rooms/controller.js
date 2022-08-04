const { OK, CREATED, BAD_REQUEST } =
require("../../config/statusCode").statusCode;
require("dotenv").config();
const roomServices = require("../../services/room");
const chatServices = require("../../services/chat");

function getTime() {
  var today = new Date();
  var hours = ("0" + today.getHours()).slice(-2);
  var minutes = ("0" + today.getMinutes()).slice(-2);
  var seconds = ("0" + today.getSeconds()).slice(-2);
  var timeString = today.getTime();
  return timeString;
}

//방 생성 API
exports.createRoom = async (req, res, next) => {
  try {
    var roomId = Math.random().toString(36).slice(-8);
    publisher = "A"; //임의
    const isVaild = await roomServices.validateRoomId(roomId); // 같은 이름의 방이 있는지 검증하는 로직
    timeString = getTime();
    if (isVaild == true) {
      await roomServices.createRoom(roomId, publisher, timeString);

      res.status(CREATED).json({
        message: "방생성 성공",
        roomId: roomId,
        createdAt: timeString,
      });
    } else {
      res.status(CREATED).json({
        message: "방생성 실패",
      });
    }
  } catch (error) {
    res.status(BAD_REQUEST).json({
      message: "방생성 실패",
    });
  }
};

//방 입장 API
exports.joinRoom = async (req, res, next) => {
    const { roomId } = req.params;
    const foundRoom = await roomServices.findByRoomId(roomId);
    if(!foundRoom) {
      res.status(CREATED).json({
        message: "없는 방입니다",
        isValidRoom: false,
      });
    }
    else {
      if(foundRoom.isEnd) {
        res.status(CREATED).json({
          message: "종료된 회의 입니다.",
          isValidRoom: true,
          isEnd: true
        });
      } else {
        // 같은 방이 있으면
        //방 시작시간을 알려주는 로직이 들어가야 함
        const createTime = await roomServices.findRoomResponseTime(roomId);
        timeString = getTime();
        res.status(CREATED).json({
          message: "방입장 성공",
          roomId: roomId,
          createdAt: createTime,
          enteredAt: timeString,
          isValidRoom: true,
          isEnd: false
        });
      }
    } 
};

/* 이전 openvidu 채팅 사용하던 버전 */
exports.getEditingRoom = async (req, res, next) => {
  const roomId = req.params.roomId;
  const editingRoom = await roomServices.toEditingRoom(roomId);
  if (!editingRoom) {
    res.status(BAD_REQUEST).json({
      message: "잘못된 접근입니다",
    });
    return;
  }
  res.status(OK).json({
    editingRoom,
  });
};

exports.createChat = async (req, res, next) => {
  const roomId = req.params.roomId;
  const room = await roomServices.createChat(
    roomId,
    req.body.chatList,
    req.body.starList,
    req.body.recordMuteList
  );
  if (!room) {
    res.status(BAD_REQUEST).json({
      message: "잘못된 접근입니다",
    });
    return;
  }
  res.status(CREATED).json({
    message: "방 정보가 저장되었습니다",
  });
};

/* 새로 만든 채팅 서버 버전 아래 */
// exports.createChat = async (req, res, next) => {
//   const roomId = req.params.roomId;
//   try {
//     const chat = await chatServices.createChat(
//       roomId,
//       req.body.id,
//       req.body.nickname,
//       req.body.message,
//       req.body.startTime,
//       req.body.time
//     );
//     if (!chat) {
//       res.status(BAD_REQUEST).json({
//         message: "잘못된 접근입니다",
//       });
//       return;
//     }
//     res.status(CREATED).json({
//       message: "새로운 채팅이 저장되었습니다",
//     });
//   } catch (err) {
//     throw new Error("올바른 채팅 정보가 아닙니다");
//   }
// };

// exports.markChat = async (req, res, next) => {
//   const roomId = req.params.roomId;
//   const chatId = req.params.chatId;
//   chatServices.mark(roomId, chatId);
// }


// exports.createMuteTime = async (req, res, next) => {
//   const roomId = req.params.roomId;
//   const muteTime = await chatServices.createMuteTime(
//     roomId,
//     req.body.start,
//     req.body.end,
//   );
//   if (!muteTime) {
//     res.status(BAD_REQUEST).json({
//       message: "잘못된 접근입니다",
//     });
//     return;
//   }
//   res.status(CREATED).json({
//     message: "MUTE TIME이 저장되었습니다",
//   });
// };

// exports.getEditingRoom = async (req, res, next) => {
//   const roomId = req.params.roomId;
//   const editingRoom = await chatServices.toEditingRoom(roomId);
//   console.log("여기까지 왔습니다. 컨트롤러")
//   if (!editingRoom) {
//     res.status(BAD_REQUEST).json({
//       message: "잘못된 접근입니다",
//     });
//     return;
//   }
//   res.status(OK).json({
//     editingRoom,
//   });
// };



