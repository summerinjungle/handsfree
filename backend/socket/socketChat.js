const {createChat, mark, createMuteTime} = require("../services/chat");

let roomToIsRecog = {};
let roomToChatList = {};
let roomToRecord = {};  // [기록중지시간, 기록시작시간]

const chatSocket = (io, socket) => {
  function publicRooms() {
    const {
      sockets: {
        adapter: {sids, rooms},
      },
    } = io;
    const publicRooms = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRooms.push(key);
      }
    });
    return publicRooms;
  }


  function countRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
  }

  function enterRoomErr(sessionId, isPublisher) {
    console.log("예외처리 : 입장 - 리스트 초기화", sessionId, !publicRooms().includes(sessionId), isPublisher);
    console.log(sessionId.substr(7));
    socket[sessionId] = sessionId;
    roomToIsRecog[sessionId] = false;
    roomToChatList[sessionId] = [];
    roomToRecord[sessionId] = [0, 0];
    socket.join(sessionId);
    console.log("에러 세션 아이디",sessionId);
    socket.nsp.to(sessionId).emit("welcome", roomToIsRecog[sessionId]);
  }

  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`);
  });

  
  socket.on("enterRoom", (sessionId, isPublisher) => {
    console.log("enterRoom 받았음.");
    if (isPublisher) {
      console.log("방장입장 - 리스트 초기화", sessionId, !publicRooms().includes(sessionId), isPublisher);
      console.log(sessionId.substr(7));
      socket[sessionId] = sessionId;
      roomToIsRecog[sessionId] = false;
      roomToChatList[sessionId] = [];
      roomToRecord[sessionId] = [0, 0];
    }
    socket.join(sessionId);
    socket.nsp.to(sessionId).emit("welcome", roomToIsRecog[sessionId]);
  });


  socket.on("newMessage", (msg, sessionId, isPublisher) => {
    if (msg.text === "기록시작@") {
      if (!roomToIsRecog[sessionId]) {
        try {
          roomToRecord[sessionId][1] = msg.start;
          createMuteTime(
            sessionId.substr(7),
            roomToRecord[sessionId][0],
            roomToRecord[sessionId][1]
          );
          roomToRecord[sessionId] = [0, 0];
        } catch (err) {
          enterRoomErr(sessionId, isPublisher)
          roomToRecord[sessionId][1] = msg.start;
          createMuteTime(
            sessionId.substr(7),
            roomToRecord[sessionId][0],
            roomToRecord[sessionId][1]
          );
          roomToRecord[sessionId] = [0, 0];
        }
      }
      roomToIsRecog[sessionId] = true;
      socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
      return;
    }
    if (msg.text === "기록중지@") {
      if (roomToIsRecog[sessionId]) {
        try {
          roomToRecord[sessionId][0] = msg.start;
        } catch {
          enterRoomErr(sessionId, isPublisher)
        }
      }
      roomToIsRecog[sessionId] = false;
      socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
      return;
    }

    if (roomToIsRecog[sessionId]) {
      if (msg.text === "별표&") {
        const chatList = roomToChatList[sessionId]
        msg.star = true
        try {
          roomToChatList[sessionId][roomToChatList[sessionId].length - 1].marker = true;
          msg.text = chatList[chatList.length - 1].message;
          msg.userId = chatList[chatList.length - 1].nickname;
          msg.time = chatList[chatList.length - 1].time;
          // marker값 수정
          mark(sessionId.substr(7), chatList.length - 1);
          socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
        } catch (err) {
          console.log("예외처리 : 메시지 없는데 별표한 경우")
        }
        return;
      }

      // 채팅리스트 등록
      socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
      const chatItem = {
        id: roomToChatList[sessionId].length,
        marker: false,
        message: msg.text,
        nickname: msg.userId,
        play: false,
        startTime: msg.start,
        time:msg.time
      };
      roomToChatList[sessionId].push(chatItem);
      // DB저장
      createChat(
        sessionId.substr(7),
        roomToChatList[sessionId].length - 1,
        msg.userId,
        msg.text,
        msg.start,
        msg.time
      );
    }
  });


  socket.on('forceDisconnect', (sessionId, isPublisher) => {
    try {
    if (isPublisher) {
      const date = new Date();
      // 기록 중지로 끝난경우
      if (roomToRecord[sessionId][1] === 0 && roomToRecord[sessionId][0] !== 0) {
        createMuteTime(
          sessionId.substr(7),
          roomToRecord[sessionId][0],
          date.getTime()
        );
      }
    }
    } catch (err) {
      console.log(err);
    }
    delete roomToIsRecog[sessionId];
    delete roomToChatList[sessionId];
    delete roomToRecord[sessionId];
    socket.leaveAll();
    socket.join(socket.id)
    // socket.disconnect();
    // console.log("남은 사람 : ", countRoom(sessionId));
    // console.log("남은 방: ", socket.rooms);
  });


  // socket.on("disconnecting", () => {
  //   if (countRoom(socket["sessionId"]) === 1) {

  //   }
  // });

  // socket.on('disconnect', (sessionId) => {
  //   socket.leave(sessionId);
  //   // console.log("남은 사람 : ", countRoom(sessionId));
  // });
}

module.exports = chatSocket;