const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Quiz = require('../models/Quiz');
const PlacementDrive = require('../models/PlacementDrive');
const Resource = require('../models/Resource');
const Report = require('../models/Report');

// Admin Dashboard Summary Metrics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'Student' });
    const officerCount = await User.countDocuments({ role: 'Placement Officer' });
    const adminCount = await User.countDocuments({ role: 'Admin' });

    const totalQuizzes = await Quiz.countDocuments();
    const totalDrives = await PlacementDrive.countDocuments();
    const totalResources = await Resource.countDocuments();
    const totalReports = await Report.countDocuments();

    const profiles = await StudentProfile.find();
    const avgScore = profiles.length > 0
      ? Math.round(profiles.reduce((sum, p) => sum + (p.readinessScore || 0), 0) / profiles.length)
      : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        studentCount,
        officerCount,
        adminCount,
        totalQuizzes,
        totalDrives,
        totalResources,
        totalReports,
        avgReadinessScore: avgScore
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Manage Users (Get All)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (user.role === 'Student') {
      await StudentProfile.findOneAndDelete({ userId });
    }

    res.json({ success: true, message: `User ${user.email} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Student', 'Placement Officer', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, message: 'User role updated successfully.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
