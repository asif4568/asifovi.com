const express = require('express');
const router = express.Router();
const { 
  submitContactForm, 
  getContactSubmissions,
  updateContactStatus
} = require('../controllers/contactController');

// Submit contact form
router.post('/', submitContactForm);

// Get all contact submissions (would be protected in production)
router.get('/', getContactSubmissions);

// Update contact status (would be protected in production)
router.put('/:id', updateContactStatus);

module.exports = router; 