const RoomInfo = require('../models/Room');


exports.createRoom = async ({roomId, publisher, timeString}) => {

  console.log("1", roomId);
  console.log("2", publisher);
  console.log("3", timeString);

  try {
    const roomInfo = new RoomInfo({
      roomid : roomId,
      publisher : publisher,
      isrecording : true,
      // recordingURL : "",
      // createAt : timeString,
      // chatinglist : [],
      // email_list : [],
    });
    
    let saveRoom = await roomInfo.save()
      .then(() => console.log('Saved successfully'));

  } catch(err) {

  console.log(" don't saved : ", saveRoom);
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