const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createRoom);

module.exports = router;
