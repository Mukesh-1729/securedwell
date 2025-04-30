const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Property = require('../models/property');

// Middleware to check if user is logged in as buyer
const isBuyer = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'buyer') {
    return next();
  }
  res.redirect('/login');
};

router.get('/dashboard', isBuyer, async (req, res) => {
  try {
    // Get the latest properties to show on dashboard
    const latestProperties = await Property.find({ status: 'Approved' })
      .sort({ createdAt: -1 })
      .limit(4);
    
    res.render('buyer/dashboard', { latestProperties });
  } catch (err) {
    console.error(err);
    res.render('buyer/dashboard', { error: 'Error loading dashboard' });
  }
});

router.get('/profile', isBuyer, async (req, res) => {
  try {
    const buyer = await User.findById(req.session.user._id);
    res.render('buyer/profile', { buyer });
  } catch (err) {
    console.error(err);
    res.redirect('/buyer/dashboard');
  }
});

// Add property to favourites
router.post('/favourites/add/:propertyId', isBuyer, async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const userId = req.session.user._id;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).send('Property not found');
    }
    
    // Add property to favourites if not already added
    const user = await User.findById(userId);
    if (!user.favourites.includes(propertyId)) {
      user.favourites.push(propertyId);
      await user.save();
    }
    
    // Update session user
    req.session.user = user;
    
    // Redirect back to property details
    res.redirect(`/property/${propertyId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Remove property from favourites
router.post('/favourites/remove/:propertyId', isBuyer, async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const userId = req.session.user._id;
    
    // Remove property from favourites
    await User.findByIdAndUpdate(userId, {
      $pull: { favourites: propertyId }
    });
    
    // Update session user
    const updatedUser = await User.findById(userId);
    req.session.user = updatedUser;
    
    // Redirect back to property details
    res.redirect(`/property/${propertyId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// View favourites
router.get('/favourites', isBuyer, async (req, res) => {
  try {
    const userId = req.session.user._id;
    
    // Get user with populated favourites
    const user = await User.findById(userId).populate('favourites');
    
    res.render('buyer/favourites', { 
      favourites: user.favourites || [] 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/buyer/dashboard');
  }
});

module.exports = router;
