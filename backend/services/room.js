const { createRoom, findByRoomId, findoneByRoomId } = require('../database/room');
// const { user } = require('../routes');
const { to } = require('await-to-js');


exports.createRoom = async ({roomId, publisher, timeString}) => {

    await createRoom({roomId, publisher, timeString});

};

exports.validateRoomId = async(roomId) => {

    const findRoom = await to(findByRoomId(roomId));

    console.log("!!!!@#!@#!@#", findRoom[1]);

    if (findRoom[1].length != 0){
        console.log("존재하는 방");
        return false; 
    }
    else{
        console.log("존재하지 않는 방");
        return true;
    }
}

exports.findRoomResponseTime = async(roomId) => {

    const findRoom = await to(findoneByRoomId(roomId));

    return findRoom[1].createdAt;
    // console.log("findRoom[1]", findRoom[0].createdAt);
    
}

