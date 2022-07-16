require("dotenv").config()
const { OK, CREATED, BAD_REQUEST } = require('../../config/statusCode').statusCode;
const {OAuth2Client, UserRefreshClient} = require('google-auth-library');
const client = new OAuth2Client(process.env.NODE_APP_GOOGLE_LOGIN_CLIENT_ID);
const userServices = require('../../services/user');
const jwt = require('jsonwebtoken');
const User = require("../../models/User");


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
        const login_user = await userServices.upsert({
            filter: {email: email},
            update: {
                name: name,
                email: email
            }
        })

        res.status(OK).json(login_user);

        
        
        // const user = await userServices.findByEmail(email);


        // if(user) {
        //     const token = jwt.sign({data:user.email}, process.env.NODE_APP_JWT_SECRET, {expiresIn: '10m'});
        //     const {_id, name, email} = user;
        //     console.log(_id, name, email);
        //     res.json({
        //         token,
        //         user: {_id, name, email}
        //     })
        // } else {
        //     let newUser = new User(name, email);


        // }


    } catch (error) {
        res.status(BAD_REQUEST).json({
            message: '구글 로그인 실패',
        });
    }
};
