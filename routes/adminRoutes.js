const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Property = require('../models/property');
const mongoose = require('mongoose');

// Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error('Invalid ObjectId format:', req.params.id);
    return res.status(400).send(`Invalid ID format: ${req.params.id}`);
  }
  next();
};

// Hardcoded credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123'; // In real projects, use environment vars & hashing
const SUPER_KEY = '2005'; // Change this to your secret key

router.get('/login', (req, res) => {
  res.render('admin/login');
});

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('superKey').notEmpty().withMessage('Super Key is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/login', { errors: errors.array() });
    }

    const { email, password, superKey } = req.body;

    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD &&
      superKey === SUPER_KEY
    ) {
      // Save session
      req.session.user = {
        email: ADMIN_EMAIL,
        role: 'admin'
      };
      return res.redirect('/admin/dashboard');
    } else {
      return res.render('admin/login', { error: 'Invalid admin credentials or super key' });
    }
  }
);

router.get('/dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/admin/login');
  }

  try {
    // Fetch properties from the database
    const properties = await Property.find();

    // Render the dashboard with property listings
    res.render('admin/dashboard', {
      properties
    });
  } catch (error) {
    console.error(error);
    res.render('admin/dashboard', {
      error: 'Error loading properties. Please try again later.'
    });
  }
});

// New route to view property details including images and documents
router.get('/property/:id', validateObjectId, async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/admin/login');
  }

  try {
    console.log('Looking for property with ID:', req.params.id);
    
    const property = await Property.findById(req.params.id).populate('seller');
    
    if (!property) {
      console.error('Property not found with ID:', req.params.id);
      return res.status(404).send(`Property not found with ID: ${req.params.id}`);
    }
    
    console.log('Property found:', property.title);
    res.render('admin/propertyDetails', { property });
  } catch (error) {
    console.error('Error in /property/:id route:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Admin action to approve or reject a property
router.get('/approve/:id', validateObjectId, async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/admin/login');
  }

  try {
    const propertyId = req.params.id;
    // Update the status of the property to 'Approved'
    const property = await Property.findByIdAndUpdate(propertyId, { status: 'Approved' });

    if (property) {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/admin/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
});

router.get('/reject/:id', validateObjectId, async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/admin/login');
  }

  try {
    const propertyId = req.params.id;
    // Update the status of the property to 'Rejected'
    const property = await Property.findByIdAndUpdate(propertyId, { status: 'Rejected' });

    if (property) {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/admin/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
});

// Debug route to test property finding
router.get('/debug/:id', validateObjectId, async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Debug - Looking for property with ID:', id);
    
    // Try to find the property
    const property = await Property.findById(id);
    
    if (!property) {
      return res.send('Property not found with ID: ' + id);
    }
    
    return res.json({
      success: true,
      property: property
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return res.status(500).send('Error: ' + error.message);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {  
    if (err) console.log("Logout error:", err);
    res.redirect('/');
  });
});

module.exports = router;
