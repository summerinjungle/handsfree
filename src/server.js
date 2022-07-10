import http from "http";
import { Server } from "socket.io";
import { instrument } from '@socket.io/admin-ui';
import express from "express";


const app = express();


app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false
});

// 연결이 되었을 때와 연결이 끊겼을 때 publicRooms 함수를 사용하면
// 방이 존재하는지, 존재하지 않는지 확인할 수 있다.
function publicRooms() {
  const {
    sockets: {
      adapter: {sids, rooms},
    },
  } = wsServer; // wsServer에서 sids와 rooms 가져오기

  //public room list 만들기
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}


function countRoom(rooName) {
  return wsServer.sockets.adapter.rooms.get(rooName)?.size;
}


// 백엔드에서 connection을 받을 준비
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  // 모든 이벤트를 핸들링하는 리스너(이벤트 핸들러)를 정의함.
  socket.onAny((event) => {
    // console.log(wsServer.sockets.adapter);
    console.log(`Socket Event : ${event}`);
  });
  

  // 방에 들어옴
  socket.on("enter_room", (roomName, done) => {
    // 이름이 roomName인 room에 입장한다.
    socket.join(roomName);
    // 인자로 받은 함수를 FE에서 실행
    done();
    // roomName 룸에 있는 모든 사람들에게 welcome 이벤트를 emit했다.
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  

  // 닉네임 설정
  socket.on("nickname", nickname => socket["nickname"] = nickname);
  console.log(socket["nickname"]);


  // 새로운 메시지 받았을때
  socket.on("new_message", (msg, room, done) => {
    // 방에 있는 사람들에게 메시지를 뿌려줌
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    // 인자로 받은 함수FE에서 실행
    done();
  });


  // 연결종료시 각방의 사람들에게 메시지를 뿌림
  socket.on("disconnecting", () => {
    console.log(socket.rooms);
    socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)); // 각 방에 있는 모든 사람들에게
  });

  socket.on("disconnect", () => {
    // 클라이언트가 종료메시지를 모두에게 보내고 room이 변경되었다고 모두에게 알림
    wsServer.sockets.emit("room_change", publicRooms());
  });
});


// 서버 연결!
const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);