const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  content: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  tags: [{ type: String }],
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
