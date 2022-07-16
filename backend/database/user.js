const User = require('../models/User');

// async function getUserById(id) {
//   return await UserModel.findById(id).exec();
// };

exports.findByEmail = async (email) => {
  return await User.findOne({ 'email': email }).exec();
};

exports.upsert = async ()

