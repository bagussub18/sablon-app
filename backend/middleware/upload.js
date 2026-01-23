const multer = require ('multer');
const CloudinaryStorage  = require ('multer-storage-cloudinary');
const cloudinary = require ('../config/cloudinary.js');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sablon',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export const upload = multer({ storage });
