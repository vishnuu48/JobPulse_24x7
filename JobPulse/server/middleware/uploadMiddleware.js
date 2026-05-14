const multer = require('multer');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed'));
    return;
  }

  cb(null, true);
};

const uploadJobImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const handleJobImageUpload = (req, res, next) => {
  uploadJobImage.single('jobImage')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
      ? 'Job image must be 5MB or smaller'
      : error.message;

    res.status(400).json({ success: false, message });
  });
};

module.exports = {
  handleJobImageUpload,
  uploadJobImage
};
