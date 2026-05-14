const express = require('express');
const { body } = require('express-validator');
const { sendContactMessage } = require('../controllers/contactController');

const router = express.Router();

const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('Subject must be between 3 and 120 characters.'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters.')
];

router.post('/', contactValidation, sendContactMessage);

module.exports = router;
