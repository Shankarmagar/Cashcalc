const multer = require('multer');

// Set up storage for multer
const storage = multer.memoryStorage(); // Store files as Buffer in memory
const upload = multer({ storage: storage });

// Middleware to handle image uploads
const handleImageUpload = (req, res, next) => {
  // The 'image' field in the request should match the name attribute in your HTML form
  const uploadImage = upload.single('image');

  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: 'Multer error: ' + err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: 'Internal server error' });
    }

    // No errors, proceed to the next middleware or route handler
    next();
  });
};

module.exports = handleImageUpload;