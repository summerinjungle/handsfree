const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createRoom);

router.post('/:roomId/join', controller.joinRoom)
// router.post('/', controller.setRoom);

module.exports = router;



