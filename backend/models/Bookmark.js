const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and tag filtering
bookmarkSchema.index({ tags: 1 });
bookmarkSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
