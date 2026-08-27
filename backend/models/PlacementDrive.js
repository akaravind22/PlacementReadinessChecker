const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: String, required: true }, // e.g. "12 LPA"
  eligibility: { type: String, default: 'CGPA >= 7.0, No active backlogs' },
  location: { type: String, default: 'Remote / Hybrid' },
  deadline: { type: String, required: true },
  description: { type: String, default: '' },
  applyLink: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
