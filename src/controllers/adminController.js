const adminService = require('../services/adminService');

/**
 * Admin Controller - Handles HTTP requests and responses for admin operations
 */
class AdminController {
  /**
   * Login admin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }
      
      const token = await adminService.login(email, password);
      
      // Set cookie
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: false // Changed to false so JavaScript can access it
      };
      
      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }
      
      res.status(200)
        .cookie('token', token, options)
        .json({
          success: true,
          token
        });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid credentials'
      });
    }
  }

  /**
   * Get current logged in admin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMe(req, res) {
    try {
      // We already verified the token in the auth middleware
      // Just return success
      res.status(200).json({
        success: true,
        data: {
          id: req.admin.id
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }

  /**
   * Forgot password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an email'
        });
      }
      
      const resetToken = await adminService.forgotPassword(email);
      
      // In a real application, you would send an email with the reset link
      // For this example, we'll just return the token
      res.status(200).json({
        success: true,
        resetToken
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Email could not be sent'
      });
    }
  }

  /**
   * Reset password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetPassword(req, res) {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a password'
        });
      }
      
      await adminService.resetPassword(req.params.resettoken, password);
      
      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Invalid token'
      });
    }
  }

  /**
   * Logout admin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logout(req, res) {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // 10 seconds
      httpOnly: false
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}

module.exports = new AdminController();