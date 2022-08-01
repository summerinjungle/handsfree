const {
  createRoom,
  findByRoomId,
  findoneByRoomId,
  findRoomAndUpdate,
} = require("../database/room");
// const { user } = require('../routes');
const { to } = require("await-to-js");

exports.createRoom = async ({ roomId, publisher, timeString }) => {
  await createRoom({ roomId, publisher, timeString });
};

exports.findByRoomId = async (roomId) => {
  const findRoom = await to(findByRoomId(roomId));
  if (findRoom[1].length != 0) {
    console.log("존재하는 방");
    return findRoom[1][0];
  } else {
    console.log("존재하지 않는 방");
    return null;
  }
};

exports.validateRoomId = async (roomId) => {
  const findRoom = await to(findByRoomId(roomId));
  // console.log("!!!!@#!@#!@#", findRoom[1]);
  // console.log(findRoom[1]);
  if (findRoom[1].length != 0) {
    console.log("존재하는 방");
    return false;
  } else {
    console.log("존재하지 않는 방");
    return true;
  }
};

exports.toEditingRoom = async (roomId) => {
  const foundRoomRet = await findByRoomId(roomId);
  if (!foundRoomRet.length) {
    return null;
  }
  const foundRoom = foundRoomRet[0];
  let chatList = null;

  try {
    chatList = foundRoom.chatList;
  } catch (err) {
    chatList = null;
  }

  let starList = null;
  try {
    starList = foundRoom.starList;
  } catch (err) {
    starList = null;
  }

  let recordMuteList = null;
  try {
    recordMuteList = foundRoom.recordMuteList;
  } catch (err) {
    recordMuteList = null;
  }
  return { chatList, starList, recordMuteList };
};

exports.createChat = async (roomId, chatListJson, starListJson, recordMuteListJson) => {
  console.log("방 요청이 왔습니다!");
  const foundRoom = await findByRoomId(roomId);
  if (!foundRoom) {
    return false;
  }

  let chatList = [];
  if (!chatList) {
    console.log("비었습니다!!!");
  }
  var keys = Object.keys(chatListJson);
  keys.forEach(function (key) {
    chatList.push(chatListJson[key]);
  })

  let starList = [];
  var keys = Object.keys(starListJson);
  keys.forEach(function (key) {
    starList.push(starListJson[key]);
  })

  let recordMuteList = [];
  var keys = Object.keys(recordMuteListJson);
  keys.forEach(function (key) {
    recordMuteList.push(recordMuteListJson[key]);
  })

  const filter = { roomId: roomId };
  const update = {
    isEnd: true,
    chatList: chatList,
    starList: starList,
    recordMuteList: recordMuteList,
  };

  const room = await findRoomAndUpdate(filter, update);
  return room;
};

exports.findRoomResponseTime = async (roomId) => {
  const findRoom = await to(findoneByRoomId(roomId));

  return findRoom[1].createdAt;
  // console.log("findRoom[1]", findRoom[0].createdAt);
};


// exports.getMP3File = async (roomId) => {
//   const targetWEBMFile = "https://hyunseokmemo.shop/openvidu/recordings/" + roomId + "/ownweapon.webm";  //영상 파일
//   const convertedMP3File = './' + roomId + 'webm';  //오디오 파일

//   return new ffmpeg(targetWEBMFile, (err, video) => {
//     if (!err) {
//       //#2. 동영상에서 이미지를 추출하기 (비동기 방식)
//       video.fnExtractSoundToMP3(convertedMP3File, (error, files) => {
//         if (!error) {
//           console.log('finish audio!', files);
//           // fs.open("../output_ffmpeg", )
//         }
//         else {
//           console.log(error);
//         }
//       });
//     }
//     else {
//       console.log("FFMpeg 에러!");
//     }
//   })
// };