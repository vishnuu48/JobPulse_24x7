const mongoose = require('mongoose');
const slugify = require('slugify');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  jobImage: {
    type: String,
    default: ''
  },
  location: [{
    type: String,
    trim: true
  }],
  jobType: {
    type: String,
    enum: ['Fresher', 'Experienced', 'Internship', 'WalkIn', 'WFH'],
    default: 'Fresher'
  },
  experience: {
    type: String,
    enum: ['Fresher', '0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'],
    default: 'Fresher'
  },
  qualification: [{
    type: String,
    trim: true
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  salary: {
    type: String,
    default: 'Not Disclosed'
  },
  applyLink: {
    type: String,
    required: [true, 'Apply link is required']
  },
  description: {
    type: String,
    default: ''
  },
  lastDate: {
    type: Date
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applyClicks: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

jobSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('company') || !this.slug) {
    const baseSlug = slugify(`${this.title} ${this.company}`, {
      lower: true,
      strict: true
    });
    this.slug = `${baseSlug}-${Date.now().toString(36)}`;
  }
  next();
});

jobSchema.index({ title: 'text', company: 'text', tags: 'text' });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ lastDate: 1 });
jobSchema.index({ postedDate: -1 });

module.exports = mongoose.model('Job', jobSchema);
