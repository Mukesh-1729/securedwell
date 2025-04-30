const express = require('express');
const router = express.Router();

// GET - Contact form
router.get('/contact', (req, res) => {
  res.render('contact', { success: null });
});

// POST - Handle form submission
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // You can add logic here to store in DB or send an email
  console.log('Contact form submitted:', { name, email, subject, message });

  res.render('contact', { success: 'Thank you for contacting us! We will get back to you soon.' });
});

module.exports = router;
