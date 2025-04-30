const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Log to check values for debugging
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUD_NAME ? process.env.CLOUD_NAME.trim() : 'missing',
  api_key: process.env.CLOUD_API_KEY ? process.env.CLOUD_API_KEY.trim() : 'missing',
  api_secret: process.env.CLOUD_API_SECRET ? process.env.CLOUD_API_SECRET.trim() : 'missing'
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ? process.env.CLOUD_NAME.trim() : '',
  api_key: process.env.CLOUD_API_KEY ? process.env.CLOUD_API_KEY.trim() : '',
  api_secret: process.env.CLOUD_API_SECRET ? process.env.CLOUD_API_SECRET.trim() : '',
});

module.exports = cloudinary;