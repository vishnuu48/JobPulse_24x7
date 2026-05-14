const { validationResult } = require('express-validator');
const { isContactEmailConfigured, sendContactEmail } = require('../utils/contactMailService');

exports.sendContactMessage = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please check the contact form fields.',
        errors: errors.array()
      });
    }

    if (!isContactEmailConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Contact email is not configured yet. Please add SMTP settings on the server.'
      });
    }

    await sendContactEmail(req.body);

    res.json({
      success: true,
      message: 'Message sent successfully.'
    });
  } catch (error) {
    console.error('Contact email failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to send your message right now. Please try again later.'
    });
  }
};
