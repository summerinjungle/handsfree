const express = require('express');
const UserModel = require('../models/User');
const { findByEmail } = require('../database/user');
const { use } = require('../routes');
const { to } = require('await-to-js');

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


exports.findByEmail = async ({email}) => {
    const [err, user] = await to(findByEmail(email));
    if (err) {
        throw new Error('Wrong Input');
    }
    return user;

    if (!user) {
        console.log("hello!!");
    }

    else {
        console.log(user);
    }
    // try {
        
    //     // const user = new User({
    //     //     email: email,
    //     // });
    //     // let saveUser = await user.save();
    //     // console.log("saved : ", saveUser);
    // } catch(err) {
    //     throw err;
    // }
   
    // console.log(user);
};
