const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Property = require('../models/property');

// GET: Show Approved Properties with Filter
router.get('/listings', async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      bedrooms,
      minSquareFeet,
      maxSquareFeet
    } = req.query;

    const filter = { status: 'Approved' };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }
    if (minSquareFeet) {
      filter.squareFeet = { ...filter.squareFeet, $gte: Number(minSquareFeet) };
    }
    if (maxSquareFeet) {
      filter.squareFeet = { ...filter.squareFeet, $lte: Number(maxSquareFeet) };
    }

    const approvedProperties = await Property.find(filter).sort({ createdAt: -1 });
    res.render('property/listings', { properties: approvedProperties });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET: View Property Details
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || property.status !== 'Approved') {
      return res.status(404).send('Property not found or not approved.');
    }

    const seller = await User.findById(property.seller).select('-password'); // exclude password for security

    if (!seller) {
      return res.status(404).send('Seller not found.');
    }

    // Check if property is in user's favourites
    let isFavourite = false;
    if (req.session.user && req.session.user.role === 'buyer') {
      const user = await User.findById(req.session.user._id);
      isFavourite = user.favourites.includes(property._id);
    }

    res.render('property/details', { property, seller, isFavourite });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
