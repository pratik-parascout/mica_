const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getProducts.bind(productController));
router.get('/:id', productController.getProduct.bind(productController));

// Protected routes
router.post('/', protect, upload.single('image'), productController.createProduct.bind(productController));
router.put('/:id', protect, upload.single('image'), productController.updateProduct.bind(productController));
router.delete('/:id', protect, productController.deleteProduct.bind(productController));

module.exports = router;