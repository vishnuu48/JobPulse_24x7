const Job = require('../models/Job');
const Category = require('../models/Category');
const SearchKeyword = require('../models/SearchKeyword');
const { notifyJobPosted } = require('../utils/jobNotificationService');
const { uploadJobImageFile } = require('../utils/imageStorageService');

const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getPublicJobQuery = (extraQuery = {}) => ({
  isActive: true,
  $and: [
    {
      $or: [
        { lastDate: { $exists: false } },
        { lastDate: null },
        { lastDate: { $gte: getTodayStart() } }
      ]
    },
    extraQuery
  ]
});

const normalizeSearchKeyword = (keyword = '') => keyword.trim().replace(/\s+/g, ' ').slice(0, 120);
const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.uploadJobImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const image = await uploadJobImageFile(req.file);

    res.status(201).json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

const trackSearchKeyword = async (keyword, resultCount) => {
  const displayKeyword = normalizeSearchKeyword(keyword);
  if (!displayKeyword) return;

  const normalizedKeyword = displayKeyword.toLowerCase();
  await SearchKeyword.findOneAndUpdate(
    { keyword: normalizedKeyword },
    {
      $set: {
        displayKeyword,
        lastResults: resultCount,
        lastSearchedAt: new Date()
      },
      $inc: {
        count: 1,
        totalResults: resultCount
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

exports.getJobs = async (req, res) => {
  try {
    const {
      location,
      jobType,
      experience,
      qualification,
      category,
      page = 1,
      limit = 12,
      sort = '-postedDate'
    } = req.query;

    const query = getPublicJobQuery();

    if (location) {
      const locs = Array.isArray(location) ? location : [location];
      query.location = { $in: locs };
    }
    if (jobType) {
      query.jobType = jobType;
    }
    if (experience) {
      query.experience = experience;
    }
    if (qualification) {
      const quals = Array.isArray(qualification) ? qualification : [qualification];
      query.qualification = { $in: quals };
    }
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      }
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('category', 'name slug icon color')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne(getPublicJobQuery({ slug: req.params.slug }))
      .populate('category', 'name slug icon color');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.views += 1;
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find(getPublicJobQuery({ isFeatured: true }))
      .populate('category', 'name slug icon color')
      .sort('-postedDate')
      .limit(10);

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLatestJobs = async (req, res) => {
  try {
    const jobs = await Job.find(getPublicJobQuery())
      .populate('category', 'name slug icon color')
      .sort('-postedDate')
      .limit(10);

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const { q, loc, exp, jobType, qualification, category, page = 1, limit = 12, sort = '-postedDate' } = req.query;

    const query = getPublicJobQuery();

    if (q) {
      const safeQuery = escapeRegex(normalizeSearchKeyword(q));
      query.$or = [
        { title: { $regex: safeQuery, $options: 'i' } },
        { company: { $regex: safeQuery, $options: 'i' } },
        { tags: { $regex: safeQuery, $options: 'i' } }
      ];
    }

    if (loc) {
      const locs = Array.isArray(loc) ? loc : [loc];
      query.location = { $in: locs };
    }

    if (exp) {
      query.experience = exp;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (qualification) {
      const quals = Array.isArray(qualification) ? qualification : [qualification];
      query.qualification = { $in: quals };
    }

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      }
    }

    const total = await Job.countDocuments(query);
    if (q) {
      trackSearchKeyword(q, total).catch((error) => {
        console.error('Search keyword tracking failed:', error.message);
      });
    }

    const jobs = await Job.find(query)
      .populate('category', 'name slug icon color')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    
    await Category.findByIdAndUpdate(req.body.category, {
      $inc: { jobCount: 1 }
    });

    const populatedJob = await Job.findById(job._id).populate('category', 'name slug icon color');

    res.status(201).json({ success: true, data: populatedJob });

    notifyJobPosted(populatedJob).catch((error) => {
      console.error('Job notification failed:', error.message);
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const oldCategory = job.category;
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug icon color');

    if (req.body.category && oldCategory.toString() !== req.body.category) {
      await Category.findByIdAndUpdate(oldCategory, { $inc: { jobCount: -1 } });
      await Category.findByIdAndUpdate(req.body.category, { $inc: { jobCount: 1 } });
    }

    res.json({ success: true, data: updatedJob });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await Category.findByIdAndUpdate(job.category, { $inc: { jobCount: -1 } });
    await Job.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackApplyClick = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      getPublicJobQuery({ _id: req.params.id }),
      { $inc: { applyClicks: 1 } },
      { new: true }
    ).select('applyClicks applyLink');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or expired' });
    }

    res.json({
      success: true,
      data: {
        applyClicks: job.applyClicks,
        applyLink: job.applyLink
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getJobsByLocation = async (req, res) => {
  try {
    const { city } = req.params;
    const { page = 1, limit = 12, sort = '-postedDate', jobType, experience, qualification, category } = req.query;

    const query = getPublicJobQuery({
      location: { $regex: escapeRegex(city), $options: 'i' }
    });

    if (jobType) query.jobType = jobType;
    if (experience) query.experience = experience;
    if (qualification) {
      const quals = Array.isArray(qualification) ? qualification : [qualification];
      query.qualification = { $in: quals };
    }
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('category', 'name slug icon color')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const todayStart = getTodayStart();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments(getPublicJobQuery());
    const expiredJobs = await Job.countDocuments({ isActive: true, lastDate: { $lt: todayStart } });
    const inactiveJobs = await Job.countDocuments({ isActive: false });
    const totalViews = await Job.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    const totalApplyClicks = await Job.aggregate([
      { $group: { _id: null, total: { $sum: '$applyClicks' } } }
    ]);
    const topCategories = await Job.aggregate([
      { $match: getPublicJobQuery() },
      {
        $group: {
          _id: '$category',
          jobCount: { $sum: 1 },
          views: { $sum: '$views' },
          applyClicks: { $sum: '$applyClicks' }
        }
      },
      { $sort: { views: -1, applyClicks: -1, jobCount: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          name: '$category.name',
          slug: '$category.slug',
          icon: '$category.icon',
          color: '$category.color',
          jobCount: 1,
          views: 1,
          applyClicks: 1
        }
      }
    ]);
    const topSearchKeywords = await SearchKeyword.find()
      .sort({ count: -1, lastSearchedAt: -1 })
      .limit(8)
      .select('displayKeyword keyword count lastResults totalResults lastSearchedAt');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const jobsToday = await Job.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        inactiveJobs,
        expiredJobs,
        totalViews: totalViews[0]?.total || 0,
        totalApplyClicks: totalApplyClicks[0]?.total || 0,
        jobsToday,
        applyConversionRate: totalViews[0]?.total
          ? Number((((totalApplyClicks[0]?.total || 0) / totalViews[0].total) * 100).toFixed(2))
          : 0,
        topCategories,
        topSearchKeywords
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllJobsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', sort = '-createdAt' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('category', 'name slug icon color');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
