const mongoose = require('mongoose');

const searchKeywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    maxlength: 120
  },
  displayKeyword: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  count: {
    type: Number,
    default: 0
  },
  totalResults: {
    type: Number,
    default: 0
  },
  lastResults: {
    type: Number,
    default: 0
  },
  lastSearchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

searchKeywordSchema.index({ count: -1 });
searchKeywordSchema.index({ lastSearchedAt: -1 });

module.exports = mongoose.model('SearchKeyword', searchKeywordSchema);
