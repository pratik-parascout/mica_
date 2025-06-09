const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Product model
const Product = require('../src/models/product');

/**
 * Script to seed demo products with high-quality images
 * Usage: node scripts/seedDemoProducts.js
 */

const demoProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers and professionals.',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Smart Fitness Tracker',
    description: 'Monitor your health and fitness goals with our advanced smart tracker. Features heart rate monitoring, sleep tracking, GPS, and 7-day battery life. Water-resistant design for all activities.',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Powerful 360-degree sound in a compact, portable design. Waterproof construction with 20-hour battery life. Perfect for outdoor adventures and home entertainment.',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging for all Qi-enabled devices. Sleek design with LED indicators and overcharge protection. Compatible with phones, earbuds, and smartwatches.',
    image: 'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Smart Home Security Camera',
    description: '4K Ultra HD security camera with night vision, two-way audio, and motion detection. Cloud storage included with mobile app control for complete home monitoring.',
    image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support, adjustable height, and breathable mesh fabric. Designed for all-day comfort and productivity.',
    image: 'https://images.pexels.com/photos/586996/pexels-photo-586996.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'LED Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness, color temperature control, and USB charging port. Energy-efficient design with touch controls.',
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free with leak-proof design.',
    image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand with heat dissipation design. Ergonomic viewing angle reduces neck strain. Compatible with all laptop sizes.',
    image: 'https://images.pexels.com/photos/205316/pexels-photo-205316.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Wireless Mouse',
    description: 'Precision wireless mouse with ergonomic design and long battery life. Silent clicking technology and adjustable DPI for optimal performance.',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Phone Camera Lens Kit',
    description: 'Professional camera lens kit for smartphones including wide-angle, macro, and fisheye lenses. Enhance your mobile photography with studio-quality results.',
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Eco-friendly bamboo cutting board set with different sizes for various food prep needs. Antimicrobial properties and easy maintenance.',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

async function seedDemoProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/mica', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing products (optional)
    const existingCount = await Product.countDocuments();
    console.log(`Found ${existingCount} existing products`);

    if (existingCount > 0) {
      console.log('Clearing existing products...');
      await Product.deleteMany({});
      console.log('Existing products cleared');
    }

    // Insert demo products
    console.log('Inserting demo products...');
    const insertedProducts = await Product.insertMany(demoProducts);
    
    console.log(`✅ Successfully inserted ${insertedProducts.length} demo products!`);
    console.log('');
    console.log('Demo products created:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
    });
    
    console.log('');
    console.log('🌐 View products at: http://localhost:3000/products');

  } catch (error) {
    console.error('❌ Error seeding demo products:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the script
seedDemoProducts();