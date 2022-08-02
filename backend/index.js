const express = require("express");
const { OK, CREATED, BAD_REQUEST } = require('./config/statusCode').statusCode;
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cookieParser = require("cookie-parser");
const socketHandle = require("./socketHandle");
const socketChat = require("./socket/socketChat");

// const apiRouter = require("./routes");

// const app = express();
// const http = require("http");
// const SocketIO = require("socket.io");
// const server = http.createServer(app);
// const cors = require("cors");
// const io = SocketIO(server, {
//   cors: {
//     origin: "*",
//     method: ["GET", "POST"],
//   }
// });

// const port = 5000;

const { test } = require("./test/test.js");
connect();
test();
// app.use(cors());
// //application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// //application/json
// app.use(bodyParser.json());
// app.use(cookieParser());

// app.use("/api", apiRouter);

// server.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });

// io.on('connection', socket => {
//   // console.log("socket handle start !! ");
//   socketHandle(io, socket);
//   socketChat(io, socket);
// })

// app.use(function (error, req, res, next) {
//   res.status(BAD_REQUEST).json({ message: error.message })
// })
