const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;
const {OAuth2Client, UserRefreshClient} = require('google-auth-library');
const client = new OAuth2Client(process.env.NODE_APP_GOOGLE_LOGIN_CLIENT_ID);
const userServices = require('../../services/user');
const jwt = require('jsonwebtoken');


/*
    POST /api/auth/
    * 사용자 가입(추가) API
*/
exports.googleLogin = async (req, res, next) => {

    try {
        const {credential} = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NODE_APP_GOOGLE_LOGIN_CLIENT_ID
        });
        const { name, email} = ticket.getPayload();
        const user = await userServices.findByEmail(email);
        if(user) {
            const token = jwt.sign({_id:user.email})
        } else {

        }


    } catch (error) {
        res.status(BAD_REQUEST).json({
            message: '구글 로그인 실패',
        });
    }
};
