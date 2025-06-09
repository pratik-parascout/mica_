const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

/**
 * Protect routes - Middleware to verify JWT token and set req.admin
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set req.admin
    req.admin = { id: decoded.id };

    // Skip database lookup for better performance
    // We'll only check if the token is valid
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};
