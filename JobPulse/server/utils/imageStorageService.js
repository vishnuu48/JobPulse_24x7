const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

const localJobsUploadDir = path.join(__dirname, '..', 'uploads', 'jobs');

const extensionByMimeType = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
};

const getSafeBaseName = (originalName = '') => {
  const extension = path.extname(originalName).toLowerCase();
  return path
    .basename(originalName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'job-image';
};

const getStorageProvider = () => {
  const provider = process.env.IMAGE_STORAGE_PROVIDER || process.env.UPLOAD_STORAGE_PROVIDER;
  if (provider) return provider.toLowerCase();

  return hasCloudinaryCredentials() ? 'cloudinary' : 'local';
};

const hasCloudinaryCredentials = () => {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  );
};

const configureCloudinary = () => {
  if (!hasCloudinaryCredentials()) {
    const error = new Error(
      'Cloudinary image storage is selected, but Cloudinary credentials are not configured'
    );
    error.statusCode = 500;
    throw error;
  }

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config(true);
    cloudinary.config({ secure: true });
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
};

const buildFileMetadata = (file, storage, url, filename) => ({
  url,
  filename,
  originalName: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  storage
});

const saveJobImageLocally = async (file) => {
  await fs.promises.mkdir(localJobsUploadDir, { recursive: true });

  const extension = path.extname(file.originalname).toLowerCase() || extensionByMimeType[file.mimetype] || '';
  const filename = `${Date.now()}-${getSafeBaseName(file.originalname)}${extension}`;
  const filePath = path.join(localJobsUploadDir, filename);

  await fs.promises.writeFile(filePath, file.buffer);

  return buildFileMetadata(file, 'local', `/uploads/jobs/${filename}`, filename);
};

const uploadJobImageToCloudinary = async (file) => {
  configureCloudinary();

  const folder = process.env.CLOUDINARY_FOLDER || 'jobpulse/jobs';
  const publicId = `${Date.now()}-${getSafeBaseName(file.originalname)}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: false
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(buildFileMetadata(file, 'cloudinary', result.secure_url, result.public_id));
      }
    );

    uploadStream.end(file.buffer);
  });
};

const uploadJobImageFile = async (file) => {
  if (!file?.buffer) {
    const error = new Error('Please upload an image file');
    error.statusCode = 400;
    throw error;
  }

  const provider = getStorageProvider();

  if (provider === 'cloudinary') {
    return uploadJobImageToCloudinary(file);
  }

  if (provider === 'local') {
    return saveJobImageLocally(file);
  }

  const error = new Error(`Unsupported image storage provider: ${provider}`);
  error.statusCode = 500;
  throw error;
};

module.exports = {
  uploadJobImageFile
};
