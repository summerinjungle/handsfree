const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createRoom);
router.post('/:roomId/chat', controller.createChat);
router.get('/:roomId/editingroom', controller.getEditingRoom);

module.exports = router;



