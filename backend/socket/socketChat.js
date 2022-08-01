const {createChat, mark, createMuteTime} = require("../services/chat");


let roomToIsRecog = {};
let roomToStarList = {};
let roomToMuteList = {};
let roomToChatList = {};
let roomToMute = {};
let mute = { left: 0, right: 0 };


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


  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`);
  });

  
  socket.on("enterRoom", (sessionId) => {
    if (!publicRooms().includes(sessionId)) {
      console.log("방장입장 - 리스트 초기화", sessionId);
      console.log(sessionId.substr(7));
      socket[sessionId] = sessionId;
      roomToIsRecog[sessionId] = true;
      roomToChatList[sessionId] = [];
      // roomToStarList[sessionId] = [];
      // roomToMuteList[sessionId] = [];
      roomToMute[sessionId] = mute;
    }
    socket.join(sessionId);
    socket.nsp.to(sessionId).emit("welcome", roomToIsRecog[sessionId]);
  });


  socket.on("newMessage", (msg, sessionId) => {
    if (msg.text === "기록시작@") {
      if (!roomToIsRecog[sessionId]) {
        // DB저장
        // roomToMuteList[sessionId][roomToMuteList[sessionId].length - 1].right = msg.startTime;
        roomToMute[sessionId].right = msg.startTime;
        createMuteTime(
          sessionId.substr(7),
          roomToMute[sessionId].left,
          roomToMute[sessionId].right
        );
        roomToMute[sessionId] = mute;
      }
      roomToIsRecog[sessionId] = true;
      socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
      return;
    }
    if (msg.text === "기록중지@") {
      if (roomToIsRecog[sessionId]) {
        roomToMute[sessionId].left = msg.startTime;
      }
      roomToIsRecog[sessionId] = false;
      socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
      return;
    }

    if (roomToIsRecog[sessionId]) {
      if (msg.text === "별표&") {
        const chatList = roomToChatList[sessionId]
        const time = chatList[chatList.length - 1].startTime;
        // roomToStarList[sessionId].push({ time : time })
        msg.star = true
        roomToChatList[sessionId][roomToChatList[sessionId].length - 1].marker = true;
        msg.text = chatList[chatList.length - 1].message;
        // marker값 수정
        mark(sessionId.substr(7), chatList.length - 1);
        socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
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
        startTime: msg.startTime,
        time:msg.time
      };
      roomToChatList[sessionId].push(chatItem);
      // DB저장
      createChat(
        sessionId.substr(7),
        roomToChatList[sessionId].length - 1,
        msg.userId,
        msg.text,
        msg.startTime,
        msg.time
      );
    }
  });

//   socket.on("disconnecting", () => {
//     if (countRoom(socket["sessionId"]) === 1) {

//     }
//   });
//   socket.on('disconnect', (sessionId) => {
//     socket.leave(sessionId);
//     // console.log("남은 사람 : ", countRoom(sessionId));
//  });

  socket.on('forceDisconnect', (sessionId, isPublisher) => {
    // 기록 중지로 끝난경우
    if (roomToMute[sessionId].right === 0) {
      createMuteTime(
        sessionId.substr(7),
        roomToMute[sessionId].left,
        new Date().getTime()
      );
    }

    // console.log("chatList", roomToChatList[sessionId])
    // console.log("starList", roomToStarList[sessionId])
    // console.log("muteList", roomToMuteList[sessionId])
    // console.log(isPublisher)
    delete roomToIsRecog[sessionId];
    delete roomToChatList[sessionId];
    // delete roomToStarList[sessionId];
    // delete roomToMuteList[sessionId];
    delete roomToMute[sessionId];
    socket.leaveAll();
    socket.join(socket.id)
    // socket.disconnect();
    // console.log("남은 사람 : ", countRoom(sessionId));
    // console.log("남은 방: ", socket.rooms);
  });
}

module.exports = chatSocket;