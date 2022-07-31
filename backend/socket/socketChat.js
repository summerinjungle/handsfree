let roomToIsRecog = {};

let starList = [];
let recordMuteList = [];
let chatList = [];

let star = { time: 0 };
let starZero = { time: 0 };

let recordMute = { left: 0, right: 0 };
let recordMuteZero = { left : 0, right: 0 };

let chat = {
  id: 0,
  marker: false,
  message: "",
  nickname: "",
  play: false,
  startTime: 0,
  time:""
};


const chatSocket = (io, socket) => {
  // 방생성여부
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

  // 방인원수
  function countRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
  }


  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`);
  });

  
  socket.on("enterRoom", (sessionId) => {
    // console.log(sessionId)
    if (!publicRooms().includes(sessionId)) {
      socket[sessionId] = sessionId;
      roomToIsRecog[sessionId] = true;
      recordMuteList = [];
      starList = [];
      chatList = []
      recordMute = {left : 0, right : 0}
    }

    socket.join(sessionId);
    // console.log(roomToIsRecog[sessionId])
    socket.nsp.to(sessionId).emit("welcome", roomToIsRecog[sessionId]);
  });


  socket.on("newMessage", (msg, sessionId) => {
  console.log(msg)
  if (msg.text === "기록시작@") {
    // 기록중지 중일때만 시작 등록
    if (!roomToIsRecog[sessionId]) {
      // console.log("기록시작");
      recordMute.right = msg.time
      recordMuteList.push(recordMute);
      recordMute = recordMuteZero;
      chat = {nickname : msg.userId, message: msg.text, startTime: msg.time};
      // chatList.push(chat);
      // console.log(chat);
    }
    roomToIsRecog[sessionId] = true;
    socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
    console.log(msg.text)
    return;
  }
      

  if (msg.text === "기록중지@") {
    // 기록중 일때만 중지 등록
    if (roomToIsRecog[sessionId]) {
      // console.log("기록중지");
      // 기록중지 시간등록
      recordMute.left = msg.time;
      chat = {nickname : msg.userId, message: msg.message, startTime: msg.time};
      // chatList.push(chat);
      // console.log(chat);
    }
    roomToIsRecog[sessionId] = false;
    socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
    console.log(msg.text)
    return;
  }


  // 기록중 일때만 별표 등록
  if (roomToIsRecog[sessionId]) {
    if (msg.text === "별표&") {
      // console.log("별표");
      star.time = chatList[chatList.length - 1].time;
      star.message = chatList[chatList.length - 1].message;
      star.id = chatList.length - 1;
      starList.push[star];
      // console.log(star);
      star = starZero;
      msg.star = true
      msg.text = chatList[chatList.length - 1].message;

    }
    // 채팅리스트 등록
    socket.nsp.to(sessionId).emit("serverToClient", msg, roomToIsRecog[sessionId]);
    console.log(msg.text)
    chat = {nickname : msg.userId, message: msg.text, startTime: msg.time};
    chatList.push(chat);
  }
  });


  // 연결종료
  socket.on("disconnecting", () => {
    if (countRoom(socket["sessionId"]) === 1) {
      console.log(recordMuteList)
      console.log(starList)
      console.log(chatList)
      delete roomToIsRecog[socket["sessionId"]];
      recordMuteList = [];
      starList = [];
      chatList = []
    }
  });


  socket.on('forceDisconnect', function() {
    socket.disconnect();
  });
}

module.exports = chatSocket;