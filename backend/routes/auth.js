const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

const ai = require('../utils/ai');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.get('/ai-status', async (req, res) => {
  const status = await ai.verifyApiKey();
  res.json(status);
});

module.exports = router;
