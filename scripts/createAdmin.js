const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Admin model
const Admin = require('../src/models/admin');

/**
 * Script to create an admin user
 * Usage: node scripts/createAdmin.js
 */

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/mica', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Admin credentials
    const adminData = {
      email: 'admin@mica.com',
      password: 'admin123456' // Change this to a secure password
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminData.email);
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create(adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the default password after first login!');
    console.log('🌐 Access admin panel at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the script
createAdmin();