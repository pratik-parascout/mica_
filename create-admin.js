const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB Connected');
  
  try {
    // Define Admin schema directly to avoid model compilation issues
    const adminSchema = new mongoose.Schema({
      email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
    
    // Create Admin model
    const Admin = mongoose.model('Admin', adminSchema);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Update admin password
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      console.log('Admin password updated successfully:');
      console.log(`Email: admin@example.com`);
      console.log(`Password: admin123`);
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Create admin user
      const admin = await Admin.create({
        email: 'admin@example.com',
        password: hashedPassword
      });
      
      console.log('Admin user created successfully:');
      console.log(`Email: admin@example.com`);
      console.log(`Password: admin123`);
    }
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating/updating admin user:', error.message);
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});