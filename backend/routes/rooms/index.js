const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createRoom);
router.post('/:roomId/join', controller.joinRoom)

router.post('/:roomId/chat', controller.createChat);
router.get('/:roomId/editingroom', controller.getEditingRoom);

/* postman으로 웹소켓 통신을 확인하기 위한 코드 */ 
// router.post('/:roomId/chat', controller.createChat);
// router.post('/:roomId/chat/:chatId/mark', controller.markChat);
// router.post('/:roomId/muteTime', controller.createMuteTime);
// router.get('/:roomId/editingroom', controller.getEditingRoom);

module.exports = router;



