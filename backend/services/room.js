const { createRoom, findByRoomId } = require('../database/room');
// const { user } = require('../routes');
const { to } = require('await-to-js');


exports.createRoom = async ({roomId, publisher, timeString}) => {

    await createRoom({roomId, publisher, timeString});

    // console.log("success");
    // const res = await findByRoomId(roomId);
    // console.log(res);
    // if(res.length) {
    //   console.log(res[0].createdAt);
    //   console.log("hell");
    //   return;
    // }
    // console.log(res);
    // if (err) {
    //     console.log("hello!!!");
    //     throw new Error('Wrong RoomdId');
    // }
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

exports.toEditingRoom = async ({roomId}) => {

    const foundRoom = await findByRoomId(roomId);
    // console.log(res);
    // console.log(res);
    // if (err) {
    //     console.log("hello!!!");
    //     throw new Error('Wrong RoomdId');
    // }
    if(foundRoom.length) {
      console.log("no room");
      return null;
    }


  return foundRoom.chatList;



  // await createRoom({roomId, publisher, timeString});
  // console.log("success");
  // if (err) {
  //     console.log("hello!!!");
  //     throw new Error('Wrong RoomdId');
  // }
};




