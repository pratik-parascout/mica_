const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// Public routes
router.get('/', viewController.renderHome.bind(viewController));
router.get('/products', viewController.renderProducts.bind(viewController));
router.get('/contact', viewController.renderContact.bind(viewController));

// Admin routes - removed protect middleware
router.get('/admin/login', viewController.renderAdminLogin.bind(viewController));
router.get('/admin/dashboard', viewController.renderAdminDashboard.bind(viewController));

module.exports = router;