import http from "http";
import WebSocket from 'ws';
import express from "express";
import { connect } from 'tls';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);
// http 열기
const server = http.createServer(app);
// http 위에 ws 서버 열기
const wss = new WebSocket.Server({server});

// front-end와 실시간으로 소통 socket => 연결된 브라우저 
// function handleConnection(socket) {
//   console.log(socket);
// }

// 샘플 DB => 소켓들이 들어오면 메시지를 다른 소켓에게 전달
const sockets = [];

// event가 발동하는 걸 기다려
// wss.on("connection", handleConnection);
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous"
  console.log("Connected to Browser");
  // 브라우저 창 끄면 출력
  socket.on("close", () => console.log("Disconnected from the Browser"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});



server.listen(3000, handleListen);
