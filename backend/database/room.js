const RoomInfo = require('../models/Room');

// async function getUserById(id) {
//   return await UserModel.findById(id).exec();
// };

const roomInfo = new RoomInfo({
  roomid : 1,
  isrecording : true,
  createAt : "123123",
  chatinglist : [],
  email_list : [],
});

// exports.findByEmail = async (email) => {
//   return await User.findOne({ 'email': email }).exec();
// };

exports.insert = async () => {
      try {
        const roomInfo = new RoomInfo({
          roomid : 1,
          isrecording : true,
          createAt : "123123",
          chatinglist : [],
          email_list : [],
        });
        let saveRoom = await user.save();
        console.log("saved : ", saveUser);
    } catch(err) {
        throw err;
    }
   
    console.log(user);
  
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