const Admin = require('../models/admin');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Admin Service - Contains business logic for admin operations
 */
class AdminService {
  /**
   * Login admin
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<string>} JWT token
   */
  async login(email, password) {
    // Check if admin exists
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(admin._id);
  }

  /**
   * Generate JWT token
   * @param {string} id - Admin ID
   * @returns {string} JWT token
   */
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  /**
   * Get admin by ID
   * @param {string} id - Admin ID
   * @returns {Promise<Object>} Admin object
   */
  async getAdminById(id) {
    return await Admin.findById(id).select('-password');
  }

  /**
   * Forgot password
   * @param {string} email - Admin email
   * @returns {Promise<string>} Reset token
   */
  async forgotPassword(email) {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error('Admin not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    admin.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await admin.save();

    return resetToken;
  }

  /**
   * Reset password
   * @param {string} resetToken - Reset token
   * @param {string} password - New password
   * @returns {Promise<boolean>} Success status
   */
  async resetPassword(resetToken, password) {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      throw new Error('Invalid token');
    }

    // Set new password (will be hashed by pre-save hook)
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    return true;
  }
}

module.exports = new AdminService();
