const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobBySlug,
  getFeaturedJobs,
  getLatestJobs,
  searchJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobsByLocation,
  getStats,
  getAllJobsAdmin,
  toggleJobStatus,
  getJobById,
  trackApplyClick,
  uploadJobImage
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { handleJobImageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/latest', getLatestJobs);
router.get('/search', searchJobs);
router.get('/stats', protect, getStats);
router.get('/admin/all', protect, getAllJobsAdmin);
router.get('/admin/:id', protect, getJobById);
router.get('/location/:city', getJobsByLocation);
router.get('/:slug', getJobBySlug);

router.post('/upload-image', protect, handleJobImageUpload, uploadJobImage);
router.post('/', protect, createJob);
router.post('/:id/apply-click', trackApplyClick);
router.put('/:id', protect, updateJob);
router.put('/:id/toggle', protect, toggleJobStatus);
router.delete('/:id', protect, deleteJob);

module.exports = router;
