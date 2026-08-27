const mongoose = require('mongoose');

const driveApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive', required: true },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

driveApplicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('DriveApplication', driveApplicationSchema);
