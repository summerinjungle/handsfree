const express = require('express');
const User = require('../models/User');
/*
 * 사용자 가입
 */
exports.setUser = async ({name, email}) => {
    try {
        const user = new User({
            name: name,
            email: email,
        });
        let saveUser = await user.save();
        console.log("saved : ", saveUser);
    } catch(err) {
        throw err;
    }
   
    // console.log(user);
};
