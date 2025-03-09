const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  dailyVisits: [{
    date: {
      type: Date,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }]
});

module.exports = mongoose.model('Visitor', visitorSchema); 