const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college: { type: String, default: '' },
  department: { type: String, default: '' },
  year: { type: String, default: '4th Year' },
  cgpa: { type: Number, default: 0 },
  backlogs: { type: Number, default: 0 },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  resume: { type: String, default: '' },
  readinessScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
