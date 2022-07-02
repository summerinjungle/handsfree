import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

// 백엔드에서 connection을 받을 준비
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  // 모든 이벤트를 핸들링하는 리스너(이벤트 핸들러)를 정의함.
  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`);
  });
  

  socket.on("enter_room", (roomName, done) => {
    // 이름이 roomName인 room에 입장한다.
    socket.join(roomName);
    // 인자로 받은 함수를 FE에서 실행
    done();
    // roomName 룸에 있는 모든 사람들에게 welcome 이벤트를 emit했다.
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  

  socket.on("nickname", nickname => socket["nickname"] = nickname);
  console.log(socket["nickname"]);


  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });


  socket.on("disconnecting", () => {
    console.log(socket.rooms);
    socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname)); // 각 방에 있는 모든 사람들에게
  });
});



const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);   // 서버 연결!