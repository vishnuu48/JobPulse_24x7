const Category = require('../models/Category');
const Job = require('../models/Job');

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

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Job.countDocuments(getPublicJobQuery({ category: cat._id }));
        return {
          ...cat.toObject(),
          jobCount: count
        };
      })
    );

    res.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const jobCount = await Job.countDocuments(getPublicJobQuery({ category: category._id }));

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        jobCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const category = await Category.create({ name, slug, icon, color });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const updateData = { icon, color };
    
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const jobCount = await Job.countDocuments({ category: category._id });
    if (jobCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${jobCount} associated jobs. Please reassign or delete the jobs first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
