const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes");
const app = express();
const http = require("http");

const port = 5000;

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
