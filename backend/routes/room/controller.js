require("dotenv").config()
const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;

exports.createRoom = async (req, res, next) => {
    console.log(req.user);
    const token = req.cookies;
};
