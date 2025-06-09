const contactService = require('../services/contactService');

/**
 * Contact Controller - Handles HTTP requests and responses for contacts
 */
class ContactController {
  /**
   * Submit contact form
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async submitContact(req, res) {
    try {
      console.log('Contact form submission received:', req.body);
      
      // Map productIds and productNames directly from request
      const contactData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message || '',
        productIds: req.body.productIds || [],
        productNames: req.body.productNames || []
      };

      console.log('Processed contact data:', contactData);
      
      const contact = await contactService.createContact(contactData);
      console.log('Contact created:', contact);

      res.status(201).json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error('Contact submission error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server Error'
      });
    }
  }

  /**
   * Get all contact submissions (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getContacts(req, res) {
    try {
      const contacts = await contactService.getAllContacts();
      
      res.status(200).json({
        success: true,
        data: contacts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }

  /**
   * Get single contact submission (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getContact(req, res) {
    try {
      const contact = await contactService.getContactById(req.params.id);
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.status(200).json({
        success: true,
        data: contact
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }

  /**
   * Delete contact submission (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteContact(req, res) {
    try {
      await contactService.deleteContact(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      res.status(error.message === 'Contact not found' ? 404 : 500).json({
        success: false,
        message: error.message || 'Server Error'
      });
    }
  }
}

module.exports = new ContactController();