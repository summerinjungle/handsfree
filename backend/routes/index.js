const router = require('express').Router();
const { authCheck } = require('./middlewares');

const auth = require('./auth');
const user = require('./user');
const room = require('./rooms');

router.use('/auth', auth);
router.use('/users', user);
// router.use('/rooms', authCheck, room);
router.use('/rooms', room);

module.exports = router;
