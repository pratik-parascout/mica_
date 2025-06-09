const productService = require('../services/productService');
const contactService = require('../services/contactService');

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
        title: 'Mica - Home',
        path: '/'
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
      console.log('Products fetched for rendering:', products);
      
      res.render('products', {
        title: 'Mica - Products',
        path: '/products',
        products: products || []
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
        title: 'Mica - Contact',
        path: '/contact'
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
      // Get contacts for the dashboard
      const contacts = await contactService.getAllContacts();
      
      res.render('admin/dashboard', {
        title: 'Mica - Admin Dashboard',
        contacts: contacts || []
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