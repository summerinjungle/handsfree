const express = require('express');
const RoomModel = require('../models/Room');         //모델의 룸
// const { findByEmail } = require('../database/user');
const { user } = require('../routes');
const { to } = require('await-to-js');




exports.setRoom = async ({roomId, timeString}) => {
    
}


exports.findByEmail = async ({email}) => {
    const [err, user] = await to(findByEmail(email));
    if (err) {
        throw new Error('Wrong Input');
    }
    return user;

    if (!user) {
        console.log("hello!!");
    }

    else {
        console.log(user);
    }

};
