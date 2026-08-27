const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  provider: { type: String, required: true },
  completionDate: { type: String, default: '' },
  certificateURL: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
