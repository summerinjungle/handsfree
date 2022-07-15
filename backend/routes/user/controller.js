const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;
const userServices = require('../../services/user');
const { User } = require('../../models/User');

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

/*
    GET /api/users/info
    * 사용자 정보 조회 API
*/
// exports.getUserInfo = async (req, res, next) => {
//   try {
//     const userNo = req.user.no;
//     const user = await userServices.getUserInfo(userNo);
//     res.status(OK).json({
//       message: '사용자 정보 조회 성공',
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/*
    GET /api/users/info/:id
    * 특정 사용자 정보 조회 API
*/

// exports.getUserInfoByNo = async (req, res, next) => {
//   try {
//     const { no } = req.params;
//     const user = await userServices.getUserInfo(no);

//     res.status(OK).json({
//       message: '사용자 정보 조회 성공',
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// var router = require('express').Router();



// router.post('', (req, res, next) => {
//     console.log("hello");
//     const user = new User(req.body);
//     //user.save() 유저 모델에 저장
//     user.save((err, doc) => {
//         if(err) return res.json({ success: false, err})
//         return res.status(200).json({
//             success: true
//         })
//     });
// })

// module.exports = router;
