const express = require('express');
const RoomModel = require('../models/Room');         //모델의 룸인데 이거 database쪽에서 작업할거임
const { createRoom } = require('../database/room');
// const { user } = require('../routes');
const { to } = require('await-to-js');


exports.createRoom = async ({roomId, publisher, timeString}) => {

    const [err, roomdId] = await to(createRoom(roomId, publisher, timeString));
    if (err) {
        throw new Error('Wrong RoomdId');
    }

    // return roomId;

    // if (!user) {
    //     console.log("hello!!");
    // }

    // else {
    //     console.log(user);
    // }
};

