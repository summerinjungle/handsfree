const RoomInfo = require('../models/Room');



exports.createRoom = async (roomId, publisher, timeString) => {
      try {
        const roomInfo = new RoomInfo({
          roomid : roomId,
          publisher : publisher,
          isrecording : true,
          recordingURL : "",
          createAt : timeString,
          chatinglist : [],
          email_list : [],
        });
        let saveRoom = await roomInfo.save();
        console.log("saved : ", saveRoom);
    } catch(err) {
        throw err;
    }
     
};



// exports.setUser = async ({name, email}) => {
//     try {
//         const user = new User({
//             name: name,
//             email: email,
//         });
//         let saveUser = await user.save();
//         console.log("saved : ", saveUser);
//     } catch(err) {
//         throw err;
//     }
   
//     // console.log(user);
// };