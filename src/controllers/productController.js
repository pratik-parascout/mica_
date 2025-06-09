const productService = require('../services/productService');

/**
 * Product Controller - Handles HTTP requests and responses for products
 */
class ProductController {
  /**
   * Get all products
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  }

  /**
   * Get single product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  }

  /**
   * Create product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body, req.file);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      // Clean up uploaded file if product creation fails
      await productService.cleanupFile(req.file);

      res.status(error.message === 'Please upload an image' ? 400 : 500).json({
        success: false,
        message: error.message || 'Server Error',
      });
    }
  }

  /**
   * Update product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body,
        req.file
      );

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      // Clean up uploaded file if product update fails
      await productService.cleanupFile(req.file);

      res.status(error.message === 'Product not found' ? 404 : 500).json({
        success: false,
        message: error.message || 'Server Error',
      });
    }
  }

  /**
   * Delete product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      res.status(error.message === 'Product not found' ? 404 : 500).json({
        success: false,
        message: error.message || 'Server Error',
      });
    }
  }
}

module.exports = new ProductController();
