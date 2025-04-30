const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Log to check values for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
    api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing'
  });
}

// Configure cloudinary with standard environment variable names
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

module.exports = cloudinary;