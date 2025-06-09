const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

/**
 * Product Service - Contains business logic for product operations
 */
class ProductService {
  /**
   * Get all products
   * @returns {Promise<Array>} Array of products
   */
  async getAllProducts() {
    return await Product.find();
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(id) {
    return await Product.findById(id);
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @param {Object} file - Uploaded file
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData, file) {
    if (!file) {
      throw new Error('Please upload an image');
    }

    const product = await Product.create({
      name: productData.name,
      image: `/uploads/${file.filename}`,
      description: productData.description
    });

    return product;
  }

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} productData - Product data
   * @param {Object} file - Uploaded file (optional)
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, productData, file) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    const updateData = {
      name: productData.name,
      description: productData.description,
      updatedAt: Date.now()
    };

    if (file) {
      // Delete old image
      try {
        const oldImagePath = path.join('public', product.image);
        await unlinkAsync(oldImagePath);
      } catch (err) {
        console.error('Error deleting old image:', err);
      }

      updateData.image = `/uploads/${file.filename}`;
    }

    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    // Delete image file
    try {
      const imagePath = path.join('public', product.image);
      await unlinkAsync(imagePath);
    } catch (err) {
      console.error('Error deleting image:', err);
    }

    await product.deleteOne();
    return true;
  }

  /**
   * Clean up uploaded file in case of error
   * @param {Object} file - File to clean up
   */
  async cleanupFile(file) {
    if (file) {
      try {
        await unlinkAsync(path.join('public', 'uploads', file.filename));
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }
}

module.exports = new ProductService();