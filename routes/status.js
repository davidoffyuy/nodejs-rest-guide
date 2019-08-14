const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const statusController = require('../controllers/status');

router.get('/', isAuth, statusController.getStatus);
router.put('/', isAuth, statusController.editStatus);

module.exports = router;