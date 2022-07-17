const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createRoom);
// router.post('/', controller.setRoom);

module.exports = router;



