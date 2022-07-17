const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createRoom);
router.get('/:roomId/editingroom', controller.getEditingRoom);
router.post('/:roomId/chat', controller.createChat);

module.exports = router;



