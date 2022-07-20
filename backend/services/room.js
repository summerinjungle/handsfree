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

exports.validateRoomId = async (roomId) => {
  const findRoom = await to(findByRoomId(roomId));

  console.log("!!!!@#!@#!@#", findRoom[1]);
  console.log(findRoom[1]);

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
  const chatList = JSON.parse(foundRoom.chatList);
  const starList = JSON.parse(foundRoom.starList);
  const recordMuteList = JSON.parse(foundRoom.recordMuteList);
  return { chatList, starList, recordMuteList };
};

exports.createChat = async (roomId, chatList, starList, recordMuteList) => {
  console.log("create chat!!", chatList);
  const foundRoom = await findByRoomId(roomId);
  if (!foundRoom) {
    return false;
  }

  const chatListStr = JSON.stringify(chatList);
  const starListStr = JSON.stringify(starList);
  const recordMuteListStr = JSON.stringify(recordMuteList);
  const filter = { roomId: roomId };
  const update = {
    chatList: chatListStr,
    starList: starListStr,
    recordMuteList: recordMuteListStr,
  };

  const room = await findRoomAndUpdate(filter, update);
  return room;
};

exports.findRoomResponseTime = async (roomId) => {
  const findRoom = await to(findoneByRoomId(roomId));

  return findRoom[1].createdAt;
  // console.log("findRoom[1]", findRoom[0].createdAt);
};
