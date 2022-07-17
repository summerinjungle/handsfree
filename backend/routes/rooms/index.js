const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.setRoom);
// router.post('/', controller.setRoom);

module.exports = router;



