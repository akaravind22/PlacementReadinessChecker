const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  generatedDate: { type: Date, default: Date.now },
  metrics: {
    totalStudents: { type: Number, default: 0 },
    avgReadinessScore: { type: Number, default: 0 },
    placedEligibleCount: { type: Number, default: 0 },
    topSkills: [{ type: String }],
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
