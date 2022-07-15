// https://github.com/boostcamp-2020/Project04-A-Whale/blob/master/server/routes/index.js
const router = require('express').Router();
const userRouter = require('./user');

router.use('/users', userRouter);

module.exports = router;
