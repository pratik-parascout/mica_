const productService = require('../services/productService');

/**
 * View Controller - Handles rendering views for the frontend
 */
class ViewController {
  /**
   * Render home page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async renderHome(req, res) {
    try {
      res.render('index', {
        title: 'Mica - Home'
      });
    } catch (error) {
      console.error('Error rendering home page:', error);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Render products page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async renderProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.render('products', {
        title: 'Mica - Products',
        products
      });
    } catch (error) {
      console.error('Error rendering products page:', error);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Render contact page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async renderContact(req, res) {
    try {
      res.render('contact', {
        title: 'Mica - Contact'
      });
    } catch (error) {
      console.error('Error rendering contact page:', error);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Render admin dashboard
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async renderAdminDashboard(req, res) {
    try {
      // Skip authentication check for now - we'll handle it client-side
      res.render('admin/dashboard', {
        title: 'Mica - Admin Dashboard'
      });
    } catch (error) {
      console.error('Error rendering admin dashboard:', error);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Render admin login page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async renderAdminLogin(req, res) {
    try {
      res.render('admin/login', {
        title: 'Mica - Admin Login'
      });
    } catch (error) {
      console.error('Error rendering admin login page:', error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = new ViewController();