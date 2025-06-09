const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const contactController = require('../controllers/contactController');

// Public routes
router.post('/', contactController.submitContact.bind(contactController));

// Protected routes
router.get('/', protect, contactController.getContacts.bind(contactController));
router.get('/:id', protect, contactController.getContact.bind(contactController));
router.delete('/:id', protect, contactController.deleteContact.bind(contactController));

module.exports = router;