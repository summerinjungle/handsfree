// https://github.com/boostcamp-2020/Project04-A-Whale/blob/master/server/routes/user/index.js
const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.setUser);

module.exports = router;
