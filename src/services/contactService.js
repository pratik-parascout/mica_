const Contact = require('../models/contact');

/**
 * Contact Service - Contains business logic for contact operations
 */
class ContactService {
  /**
   * Create a new contact submission
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} Created contact
   */
  async createContact(contactData) {
    return await Contact.create(contactData);
  }

  /**
   * Get all contact submissions
   * @returns {Promise<Array>} Array of contact submissions
   */
  async getAllContacts() {
    return await Contact.find().sort({ createdAt: -1 });
  }

  /**
   * Get contact by ID
   * @param {string} id - Contact ID
   * @returns {Promise<Object>} Contact object
   */
  async getContactById(id) {
    return await Contact.findById(id);
  }

  /**
   * Delete a contact submission
   * @param {string} id - Contact ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteContact(id) {
    const contact = await Contact.findById(id);

    if (!contact) {
      throw new Error('Contact not found');
    }

    await contact.deleteOne();
    return true;
  }
}

module.exports = new ContactService();