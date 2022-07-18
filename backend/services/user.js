const express = require('express');
const User = require('../models/User');
const { findByEmail, upsert } = require('../database/user');
const { use } = require('../routes');
const { to } = require('await-to-js');

exports.findByEmail = async ({email}) => {
    const [err, user] = await to(findByEmail(email));
    if (err) {
        throw new Error('Wrong Input');
    }
    return user;
};

exports.upsert = async ({filter, update}) => {
    return upsert({filter, update});
};

