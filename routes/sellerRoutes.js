const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Property = require('../models/property');
const upload = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');

router.get('/dashboard', (req, res) => {
  if (req.session.user && req.session.user.role === 'seller') {
    res.render('seller/dashboard');
  } else {
    res.redirect('/login');
  }
});

// GET: Render Add Property Form
router.get('/add-property', (req, res) => {
  if (req.session.user && req.session.user.role === 'seller') {
    res.render('seller/addProperty', {
      formData: {},
      error: null
    });
  } else {
    res.redirect('/login');
  }
});

// POST: Handle Property Submission with Multer + Cloudinary
router.post('/add-property', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'landDocument', maxCount: 1 },
  { name: 'permitOrder', maxCount: 1 }
]), async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'seller') {
    return res.redirect('/login');
  }

  try {
    const {
      title,
      description,
      price,
      location,
      locationMapUrl,
      bedrooms,
      bathrooms,
      squareFeet
    } = req.body;

    // Process uploaded files and get their Cloudinary URLs
    const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const landDocument = req.files['landDocument'] ? req.files['landDocument'][0].path : '';
    const permitOrder = req.files['permitOrder'] ? req.files['permitOrder'][0].path : '';

    console.log('Uploaded images:', images);
    console.log('Land document:', landDocument);
    console.log('Permit order:', permitOrder);
    
    // Ensure the paths are properly set
    if (!images.length) {
      return res.render('seller/addProperty', {
        error: 'Please upload at least one property image',
        formData: req.body
      });
    }

    if (!landDocument || !permitOrder) {
      return res.render('seller/addProperty', {
        error: 'Please upload both land document and permit order',
        formData: req.body
      });
    }
    
    const newProperty = new Property({
      seller: req.session.user._id,
      title,
      description,
      price,
      location,
      locationMapUrl,
      bedrooms,
      bathrooms,
      squareFeet,
      images,
      landDocument,
      permitOrder,
      status: 'Pending'
    });

    await newProperty.save();
    
    // Redirect to the dashboard with success message
    req.session.successMessage = 'Property added successfully and is pending approval';
    res.redirect('/seller/dashboard');
  } catch (error) {
    console.error('Error adding property:', error.message);
    res.render('seller/addProperty', {
      error: 'Error submitting property. Please try again.',
      formData: req.body
    });
  }
});
 

  router.get('/profile',async (req, res) => {
    if (req.session.user && req.session.user.role === 'seller') {
      const seller = await User.findById(req.session.user._id);
      res.render('seller/profile', { seller });
    } else {
      res.redirect('/login');
    }
  });

  // GET: All Listed Properties by Seller
router.get('/listed-properties', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'seller') {
    return res.redirect('/login');
  }

  try {
    const sellerId = req.session.user._id;
    const properties = await Property.find({ seller: sellerId });
    res.render('seller/listedProperties', { 
      properties,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage 
    });
    
    // Clear messages after rendering
    req.session.successMessage = null;
    req.session.errorMessage = null;
  } catch (error) {
    console.error('Error fetching listed properties:', error.message);
    res.redirect('/seller/dashboard');
  }
});

// POST: Delete Property
router.post('/delete-property/:id', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'seller') {
    return res.redirect('/login');
  }

  try {
    const propertyId = req.params.id;
    const sellerId = req.session.user._id;

    // Find the property
    const property = await Property.findOne({ 
      _id: propertyId, 
      seller: sellerId 
    });

    if (!property) {
      req.session.errorMessage = 'Property not found or you do not have permission to delete it.';
      return res.redirect('/seller/listed-properties');
    }

    // // Extract public IDs from Cloudinary URLs
    // const deleteImages = async (urls) => {
    //   if (!urls || !Array.isArray(urls)) return;
      
    //   for (const url of urls) {
    //     try {
    //       if (url && typeof url === 'string' && url.includes('cloudinary.com')) {
    //         // Extract public ID from Cloudinary URL
    //         const parts = url.split('/');
    //         const filename = parts[parts.length - 1];
    //         const publicId = filename.split('.')[0]; // Remove file extension
            
    //         // Delete from Cloudinary
    //         await cloudinary.uploader.destroy('SecureDwell/' + publicId);
    //       }
    //     } catch (error) {
    //       console.error(`Error deleting image: ${url}`, error);
    //     }
    //   }
    // };

    // // Delete images from Cloudinary
    // await deleteImages(property.images);
    
    // // Delete document files
    // if (property.landDocument) {
    //   try {
    //     const parts = property.landDocument.split('/');
    //     const filename = parts[parts.length - 1];
    //     const publicId = filename.split('.')[0];
    //     await cloudinary.uploader.destroy('SecureDwell/' + publicId);
    //   } catch (error) {
    //     console.error('Error deleting land document:', error);
    //   }
    // }
    
    // if (property.permitOrder) {
    //   try {
    //     const parts = property.permitOrder.split('/');
    //     const filename = parts[parts.length - 1];
    //     const publicId = filename.split('.')[0];
    //     await cloudinary.uploader.destroy('SecureDwell/' + publicId);
    //   } catch (error) {
    //     console.error('Error deleting permit order:', error);
    //   }
    // }

    // Delete the property from the database
    await Property.findByIdAndDelete(propertyId);

    req.session.successMessage = 'Property has been successfully deleted.';
    res.redirect('/seller/listed-properties');
  } catch (error) {
    console.error('Error deleting property:', error.message);
    req.session.errorMessage = 'An error occurred while deleting the property.';
    res.redirect('/seller/listed-properties');
  }
});

module.exports = router;
