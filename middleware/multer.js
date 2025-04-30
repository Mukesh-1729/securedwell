const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// Create Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'SecureDwell',
    allowed_formats: ['jpg', 'jpeg', 'png'],  // ❌ Removed 'pdf'
    transformation: [{ width: 1000, height: 800, crop: 'limit' }],
    resource_type: 'image',  // ✅ Only images now
    format: (req, file) => {
      return path.extname(file.originalname).substring(1); // jpg, png
    },
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.fieldname + '-' + uniqueSuffix;
      return filename;
    }
  }
});

// Define file filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Accept only image files everywhere
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png) are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

module.exports = upload;
