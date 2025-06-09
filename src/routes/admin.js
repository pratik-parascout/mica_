const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Public routes
router.post('/login', adminController.login.bind(adminController));
router.post(
  '/forgotpassword',
  adminController.forgotPassword.bind(adminController)
);
router.put(
  '/resetpassword/:resettoken',
  adminController.resetPassword.bind(adminController)
);

// Protected routes
router.get('/me', protect, adminController.getMe.bind(adminController));
router.get('/logout', adminController.logout.bind(adminController));
router.get('/check-auth', protect, (req, res) => {
  res.json({ success: true });
});

module.exports = router;
