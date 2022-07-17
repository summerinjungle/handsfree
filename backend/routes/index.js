// https://github.com/boostcamp-2020/Project04-A-Whale/blob/master/server/routes/index.js
const router = require('express').Router();

const auth = require('./auth');
const user = require('./user');
const user = require('./rooms');

router.use('/auth', auth);
router.use('/users', user);

router.use('/room', user);

module.exports = router;
