const { createRoom, findByRoomId } = require('../database/room');
// const { user } = require('../routes');
const { to } = require('await-to-js');


exports.createRoom = async ({roomId, publisher, timeString}) => {

    const [err, room] = await to(createRoom({roomId, publisher, timeString}));
    // console.log(room);
    if (err) {
        throw new Error('Wrong RoomdId');
    }
    return room;
};

exports.validateRoomId = async(roomId) => {

    const findRoom = await to(findByRoomId(roomId));

    console.log(findRoom[1]);

    if (findRoom[1].length !== 0){
        console.log("존재하는 방");
        return false; //존재하는방이면
      }
      else{
        console.log("존재하지 않는 방");
        return true;
      }

    console.log("temp", temp[1]);
    return temp[1];
}

