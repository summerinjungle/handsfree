require("dotenv").config()
const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;
const {OAuth2Client, UserRefreshClient} = require('google-auth-library');


const authServices = require('../../services/auth');
const userServices = require('../../services/user');

const client = new OAuth2Client(process.env.NODE_APP_GOOGLE_LOGIN_CLIENT_ID);
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
        const {name, email} = ticket.getPayload();
        
        const login_user = await userServices.upsert({
            filter: {email: email},
            update: {
                name: name,
                email: email
            }
        })

        const token = await authServices.createAccessToken(login_user);
        res.status(OK)
        .cookie('token', token, {
            httpOnly: false
        }).cookie('name', name)
        .json({
            success: true
        });
        
    } catch (error) {
        res.status(BAD_REQUEST).json({
            message: '구글 로그인 실패',
        });
    }
};


