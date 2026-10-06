const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  domain: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  experience: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  applicationLink: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Opportunity', opportunitySchema);