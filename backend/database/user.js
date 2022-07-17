const User = require('../models/User');

exports.findByEmail = async (email) => {
  return await User.findOne({ 'email': email }).exec();
};

exports.upsert = async ({filter, update}) => {
  return await User.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true
  });
}



