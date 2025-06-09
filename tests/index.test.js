const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const Admin = require('../src/models/admin');
const Product = require('../src/models/product');
const Contact = require('../src/models/contact');
const path = require('path');

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost/mica-test');
});

afterAll(async () => {
  // Cleanup database and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear collections before each test
  await Admin.deleteMany({});
  await Product.deleteMany({});
  await Contact.deleteMany({});
});

describe('Admin Authentication', () => {
  test('Should login admin with valid credentials', async () => {
    const admin = await Admin.create({
      email: 'admin@test.com',
      password: 'password123'
    });

    const response = await request(app)
      .post('/api/admin/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('Should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/admin/login')
      .send({
        email: 'wrong@test.com',
        password: 'wrongpass'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe('Product Management', () => {
  let token;

  beforeEach(async () => {
    // Create admin and get token
    await Admin.create({
      email: 'admin@test.com',
      password: 'password123'
    });

    const loginResponse = await request(app)
      .post('/api/admin/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });

    token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  test('Should create a new product', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Cookie', `token=${token}`)
      .field('name', 'Test Product')
      .field('description', 'Test Description')
      .attach('image', path.join(__dirname, 'test-image.jpg'));

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Product');
  });

  test('Should get all products', async () => {
    await Product.create({
      name: 'Test Product 1',
      image: '/uploads/test1.jpg'
    });

    await Product.create({
      name: 'Test Product 2',
      image: '/uploads/test2.jpg'
    });

    const response = await request(app)
      .get('/api/products');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
  });
});

describe('Contact Form', () => {
  let productId;

  beforeEach(async () => {
    const product = await Product.create({
      name: 'Test Product',
      image: '/uploads/test.jpg'
    });
    productId = product._id;
  });

  test('Should submit contact form', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test@user.com',
        mobileNumber: '1234567890',
        interestedProduct: productId,
        message: 'Test message'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test User');
  });

  test('Should not submit contact form with missing required fields', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });
});