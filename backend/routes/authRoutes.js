const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/change-password', authMiddleware, authController.changePassword);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
