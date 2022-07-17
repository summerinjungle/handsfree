const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;
const userServices = require('../../services/user');
const jwt = require('jsonwebtoken');

/*
    POST /api/users/
    * 사용자 가입(추가) API
*/
exports.setUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email } = req.body;
    await userServices.setUser({name, email});
    console.log("done set");
    res.status(CREATED).json({
      message: '사용자 가입 성공',
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      message: '사용자 가입 실패',
    });
  }
};

// exports.getCurrentUser = async (req, res, next) => {
// };
