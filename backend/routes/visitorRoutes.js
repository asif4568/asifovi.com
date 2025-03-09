const express = require('express');
const router = express.Router();
const { 
  getVisitorCount, 
  incrementVisitorCount,
  getVisitorStats
} = require('../controllers/visitorController');

// Get visitor count
router.get('/', getVisitorCount);

// Increment visitor count
router.post('/', incrementVisitorCount);

// Get visitor statistics (could be protected in production)
router.get('/stats', getVisitorStats);

module.exports = router; 