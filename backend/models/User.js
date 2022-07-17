const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    }
});

module.exports = model('User', userSchema);


// // -- https://github.com/boostcampwm-2021/bookathon_B/blob/main/backend/src/models/user.js
// // const mongoose = require('mongoose');

// // const Schema = mongoose.Schema;

// // const userSchema = new Schema({
// //         nickName: String,
// //         email: String,
// //         githubId : String,
// //         accessToken: String
// // });

// // module.exports = mongoose.model('User', userSchema);

// // -- https://github.com/boostcampwm-2021/Web11-Donggle/blob/main/server/src/models/User.ts
// // import { Schema, model } from 'mongoose';

// // type CoordType = [number, number];

// // interface User {
// //   oauth_email: string;
// //   address: string;
// //   code: string;
// //   center: CoordType;
// //   image?: string;
// // }

// // const userSchema = new Schema<User>({
// //   oauth_email: { type: String, index: true },
// //   address: { type: String },
// //   code: { type: String },
// //   center: { type: [Number, Number] },
// //   image: { type: String },
// // });

// // const UserModel = model<User>('User', userSchema);

// // export { User, UserModel };
