const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");

const port = 5000;

const io = socket(server);

const users = {};

const socketToRoom = {};

connect();

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("socket  =", socket);
  socket.on("join room", (roomID) => {
    console.log("session ID ", roomID);
    if (users[roomID]) {
      // const length = users[roomID].length;
      // if (length === 4) {
      //   socket.emit("room full");
      //   return;
      // }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});
