// https://github.com/boostcamp-2020/Project04-A-Whale/blob/master/server/routes/index.js
const router = require('express').Router();
const { authCheck } = require('./middlewares');

const auth = require('./auth');
const user = require('./user');

const room = require('./rooms');

router.use('/auth', auth);
router.use('/users', user);
// router.use('/rooms', authCheck, room);
router.use('/rooms', room);

// router.use('/room', user);

module.exports = router;
