const router = require('express').Router();
const controller = require('./controller');

router.post('/google', controller.googleLogin);

module.exports = router;
