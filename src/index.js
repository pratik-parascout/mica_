const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const configureExpress = require('./config/express');

// Load env vars
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Configure Express
configureExpress(app);

// View routes
app.use('/', require('./routes/view'));

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; // Export for testing
