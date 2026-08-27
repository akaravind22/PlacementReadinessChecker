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
  },
  studentSnapshots: [{
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    department: { type: String, default: '' },
    cgpa: { type: Number, default: 0 },
    backlogs: { type: Number, default: 0 },
    readinessScore: { type: Number, default: 0 },
    category: { type: String, default: 'Needs Improvement' },
    cgpaScore: { type: Number, default: 0 },
    skillScore: { type: Number, default: 0 },
    projectScore: { type: Number, default: 0 },
    certScore: { type: Number, default: 0 },
    internshipScore: { type: Number, default: 0 },
    quizScore: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
