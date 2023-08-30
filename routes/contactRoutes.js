const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel'); // Adjust the path as needed

// API endpoint to get all contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

module.exports = router;
