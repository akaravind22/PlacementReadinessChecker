const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Internship = require('../models/Internship');
const PlacementDrive = require('../models/PlacementDrive');
const DriveApplication = require('../models/DriveApplication');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');
const Report = require('../models/Report');
const { calculateReadinessScore } = require('../utils/scoreCalculator');

// View All Students with search/filter
exports.getStudents = async (req, res) => {
  try {
    const { search, minCgpa, minScore } = req.query;
    
    let query = { role: 'Student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query).select('-password');
    const studentIds = students.map(s => s._id);

    let profileQuery = { userId: { $in: studentIds } };
    if (minCgpa) profileQuery.cgpa = { $gte: parseFloat(minCgpa) };
    if (minScore) profileQuery.readinessScore = { $gte: parseFloat(minScore) };

    const profiles = await StudentProfile.find(profileQuery).populate('userId', 'name email phone');

    res.json({ success: true, students: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View Detailed Student Profile for Officer/Admin
exports.getStudentDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Student not found.' });

    const profile = await StudentProfile.findOne({ userId });
    const skills = await Skill.find({ studentId: userId });
    const projects = await Project.find({ studentId: userId });
    const certs = await Certification.find({ studentId: userId });
    const internships = await Internship.find({ studentId: userId });
    const readinessData = await calculateReadinessScore(userId);

    res.json({
      success: true,
      user,
      profile,
      skills,
      projects,
      certifications: certs,
      internships,
      readinessData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Placement Drives CRUD
exports.getDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find().sort({ deadline: 1 });
    if (req.user.role !== 'Student') return res.json({ success: true, drives });

    const applications = await DriveApplication.find({ studentId: req.user.id }).select('driveId appliedAt');
    const applicationsByDriveId = new Map(applications.map((application) => [application.driveId.toString(), application.appliedAt]));
    res.json({
      success: true,
      drives: drives.map((drive) => ({
        ...drive.toObject(),
        isApplied: applicationsByDriveId.has(drive._id.toString()),
        appliedAt: applicationsByDriveId.get(drive._id.toString()) || null
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyToDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Placement drive not found.' });

    const application = await DriveApplication.findOneAndUpdate(
      { studentId: req.user.id, driveId: drive._id },
      { $setOnInsert: { appliedAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, message: 'Application recorded.', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDriveApplications = async (req, res) => {
  try {
    const applications = await DriveApplication.find()
      .populate('driveId', 'company role package deadline')
      .populate('studentId', 'name email')
      .sort({ appliedAt: -1 });

    const studentIds = applications.map((application) => application.studentId?._id).filter(Boolean);
    const profiles = await StudentProfile.find({ userId: { $in: studentIds } }).select('userId department readinessScore');
    const profilesByStudentId = new Map(profiles.map((profile) => [profile.userId.toString(), profile]));

    res.json({
      success: true,
      applications: applications.filter((application) => application.driveId && application.studentId).map((application) => {
        const profile = profilesByStudentId.get(application.studentId._id.toString());
        return {
          _id: application._id,
          appliedAt: application.appliedAt,
          drive: application.driveId,
          student: {
            _id: application.studentId._id,
            name: application.studentId.name,
            email: application.studentId.email,
            department: profile?.department || 'Not specified',
            readinessScore: profile?.readinessScore || 0
          }
        };
      })
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDrive = async (req, res) => {
  try {
    const { company, role, package, eligibility, location, deadline, description, applyLink } = req.body;
    if (!company || !role || !package || !deadline) {
      return res.status(400).json({ success: false, message: 'Company, role, package, and deadline are required.' });
    }

    const drive = await PlacementDrive.create({
      company,
      role,
      package,
      eligibility: eligibility || 'CGPA >= 7.0',
      location: location || 'On-Campus',
      deadline,
      description: description || '',
      applyLink: applyLink || ''
    });

    res.status(201).json({ success: true, message: 'Placement drive posted.', drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found.' });
    res.json({ success: true, message: 'Drive updated.', drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found.' });
    res.json({ success: true, message: 'Drive deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Learning Resources CRUD
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'name role').sort({ createdAt: -1 });
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { title, type, url, description } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required.' });
    }

    const resource = await Resource.create({
      title,
      type: type || 'PDF',
      url,
      description: description || '',
      uploadedBy: req.user.id
    });

    res.status(201).json({ success: true, message: 'Resource uploaded.', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    res.json({ success: true, message: 'Resource deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Notification to Students
exports.sendNotification = async (req, res) => {
  try {
    const { studentId, message, broadcast } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    if (broadcast) {
      const students = await User.find({ role: 'Student' });
      const notifications = students.map(s => ({
        studentId: s._id,
        message,
        isRead: false
      }));
      await Notification.insertMany(notifications);
      return res.json({ success: true, message: `Notification broadcasted to ${students.length} students.` });
    } else {
      if (!studentId) return res.status(400).json({ success: false, message: 'studentId required for single notification.' });
      await Notification.create({ studentId, message });
      return res.json({ success: true, message: 'Notification sent to student.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Report
exports.generateReport = async (req, res) => {
  try {
    const profiles = await StudentProfile.find();
    const totalStudents = profiles.length;
    const totalScoreSum = profiles.reduce((acc, p) => acc + (p.readinessScore || 0), 0);
    const avgScore = totalStudents > 0 ? Math.round(totalScoreSum / totalStudents) : 0;
    const eligibleCount = profiles.filter(p => p.readinessScore >= 70 && p.cgpa >= 7.0 && p.backlogs === 0).length;

    const report = await Report.create({
      title: `Placement Readiness Batch Overview - ${new Date().toLocaleDateString()}`,
      generatedBy: req.user.id,
      generatedDate: new Date(),
      metrics: {
        totalStudents,
        avgReadinessScore: avgScore,
        placedEligibleCount: eligibleCount,
        topSkills: ['Java', 'React.js', 'Python', 'SQL', 'Data Structures']
      }
    });

    res.status(201).json({ success: true, message: 'Report generated successfully.', report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy', 'name role').sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
