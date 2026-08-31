const mongoose = require('mongoose');

const driveViewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive', required: true },
  viewedAt: { type: Date, default: Date.now },
  lastViewedAt: { type: Date, default: Date.now },
  viewCount: { type: Number, default: 1 }
}, { timestamps: true });

driveViewSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('DriveView', driveViewSchema);
