const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillName: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
