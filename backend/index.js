const express = require("express");

const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cookieParser = require("cookie-parser");
const socketHandle = require("./socketHandle");

const apiRouter = require("./routes");

const app = express();
const http = require("http");
const SocketIO = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
const io = SocketIO(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

const port = 5000;

connect();
app.use(cors());
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", apiRouter);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

io.on('connection', socket => {
  socketHandle(socket);
})
