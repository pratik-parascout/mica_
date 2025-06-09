const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');

/**
 * Express configuration
 * @param {Object} app - Express app instance
 */
const configureExpress = (app) => {
  // View engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Serve static files
  app.use(express.static(path.join(__dirname, '../../public')));

  // Routes
  app.use('/api/admin', require('../routes/admin'));
  app.use('/api/products', require('../routes/product'));
  app.use('/api/contact', require('../routes/contact'));

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  });

  return app;
};

module.exports = configureExpress;
