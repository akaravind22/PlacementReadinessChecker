const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'Video', 'Article', 'Repository', 'Other'], default: 'PDF' },
  url: { type: String, required: true },
  description: { type: String, default: '' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
